import { app, ipcMain } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import log from 'electron-log/main';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import got from 'got';
// import '../../tests/mocks/server';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SPACES = / +/;
const INVALID_CHARS = /[^a-zA-Z0-9]/g;

const cleanseStreet = (data) => {
  const replacement = ' ';

  // & -> and
  let street = data.replace('&', 'and');
  street = street.replace(INVALID_CHARS, replacement);
  street = street.replace(SPACES, replacement);

  return street.trim();
};

const cleanseZone = (data) => {
  let zone = data.toString().replace(INVALID_CHARS, ' ');
  zone = zone.replace(SPACES, ' ').trim();

  if (zone.length > 0 && zone[0] == '8') {
    zone = zone.slice(0, 5);
  }

  return zone;
};

const coolYourJets = () => {
  const min = 150;
  const max = 300;

  return new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));
};

let cancelled;
export const cancelGeocode = (status = 'cancelled') => {
  cancelled = status;
};

const timeout = { request: 10000 };

export const checkApiKey = async (apiKey) => {
  log.info(`Checking API key: ${apiKey}`);

  let response;

  try {
    response = await got(`geocode/326 east south temple street/slc`, {
      headers: {
        'x-agrc-geocode-client': 'electron-api-client',
        'x-agrc-geocode-client-version': app.getVersion(),
        Referer: 'https://api-client.ugrc.utah.gov/',
      },
      searchParams: {
        apiKey: apiKey,
      },
      prefixUrl: 'https://api.mapserv.utah.gov/api/v1/',
      timeout,
    }).json();
  } catch (error) {
    if (error?.response?.body) {
      log.error(`Error checking api key: ${error.response.body}`);
      response = JSON.parse(error.response.body);
    } else {
      throw error;
    }
  }

  const isValid = response.status === 200;

  console.log({ category: 'api-key-check', label: isValid });

  return isValid;
};

const output = 'ugrc_geocode_results.csv';
export const geocode = async (event, { filePath, fields, apiKey, wkid = 26912, sampleData, totalRows }) => {
  log.info(`Geocoding: ${filePath}, ${JSON.stringify(fields)}, ${apiKey}, ${wkid}`);
  cancelGeocode(null);
  const parser = fs.createReadStream(filePath).pipe(parse({ columns: true, skipEmptyLines: true }));

  const columns = Object.keys(sampleData);
  const writer = fs.createWriteStream(path.join(app.getPath('userData'), output));
  const stringifier = stringify({ columns: [...columns, 'x', 'y', 'score', 'match_address'], header: true });
  stringifier.pipe(writer);

  let rowsProcessed = 0;
  let totalScore = 0;
  let failures = 0;
  const fastFailLimit = 25;
  let lastRequest = {
    request: {
      street: null,
      zone: null,
      url: null,
    },
    response: {
      status: 0,
      body: null,
    },
  };

  for await (const record of parser) {
    if (cancelled) {
      log.warn('Geocoding stopping');
      event.sender.send('onGeocodingUpdate', {
        totalRows,
        rowsProcessed,
        failures,
        averageScore: Math.round(totalScore / (rowsProcessed - failures)) || 0,
        activeMatchRate: (rowsProcessed - failures) / rowsProcessed || 0,
        status: cancelled,
        lastRequest,
      });

      return;
    }

    const newRecord = { ...record, x: null, y: null, score: 0, match_address: null };

    const street = cleanseStreet(record[fields.street]);
    const zone = cleanseZone(record[fields.zone]);
    let response;

    if (!street.length || !zone.length) {
      failures += 1;

      response = { status: -1 };
    } else {
      lastRequest = {
        request: {
          street,
          zone,
          url: null,
        },
        response: {
          status: 0,
          body: null,
        },
      };

      try {
        response = await got(`geocode/${street}/${zone}`, {
          headers: {
            'x-agrc-geocode-client': 'electron-api-client',
            'x-agrc-geocode-client-version': app.getVersion(),
            Referer: 'https://api-client.ugrc.utah.gov/',
          },
          searchParams: {
            apiKey: apiKey,
            spatialReference: wkid,
          },
          prefixUrl: 'https://api.mapserv.utah.gov/api/v1/',
          timeout,
        }).json();

        lastRequest.response = {
          status: response.status,
          body: response.body,
        };
      } catch (error) {
        log.error(`Error geocoding street [${street}] zone [${zone}]: ${error}`);

        try {
          response = JSON.parse(error.response.body);
        } catch {
          response = { error: error.message };
        }

        lastRequest.request.url = error?.request?.requestUrl.toString();
        lastRequest.response = {
          status: error.response?.statusCode ?? 'response is undefined', // response is undefined when got throws
          body: response?.error ?? response?.message,
        };

        failures += 1;
      }
    }

    if (response.status === 200) {
      const result = response.result;
      const {
        score,
        matchAddress,
        location: { x, y },
      } = result;

      totalScore += score;
      newRecord.score = score;
      newRecord.x = x;
      newRecord.y = y;
      newRecord.match_address = matchAddress;
    }

    stringifier.write(newRecord);

    rowsProcessed++;

    event.sender.send('onGeocodingUpdate', {
      totalRows,
      rowsProcessed,
      failures,
      averageScore: Math.round(totalScore / (rowsProcessed - failures)),
      activeMatchRate: (rowsProcessed - failures) / rowsProcessed,
      status: 'running',
      lastRequest,
    });

    if (failures === fastFailLimit && fastFailLimit === rowsProcessed) {
      cancelGeocode('fail-fast');
    }

    await coolYourJets();
  }

  stringifier.end();

  const completionStats = {
    totalRows,
    rowsProcessed,
    failures,
    averageScore: Math.round(totalScore / (rowsProcessed - failures)),
    activeMatchRate: (rowsProcessed - failures) / rowsProcessed,
    status: 'complete',
    lastRequest,
  };

  event.sender.send('onGeocodingUpdate', completionStats);
};

ipcMain.handle('checkApiKey', (_, content) => {
  return checkApiKey(content);
});
ipcMain.handle('geocode', (event, content) => {
  return geocode(event, content);
});
ipcMain.handle('cancelGeocode', () => {
  return cancelGeocode();
});
ipcMain.handle('onDragStart', (event) => {
  event.sender.startDrag({
    file: path.join(app.getPath('userData'), output),
    icon: path.resolve(__dirname, 'assets', 'draganddrop.png'),
  });
});
