import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import { app, ipcMain } from 'electron';
import log from 'electron-log/main';
import fs from 'fs';
import ky from 'ky';
import path from 'path';
// import { trackEvent } from './analytics';
// import '../../tests/mocks/server';
const SPACES = / +/;
const INVALID_CHARS = /[^a-zA-Z0-9]/g;

type KyErrorLike = {
  response?: {
    status: number;
    json: () => Promise<unknown>;
    text: () => Promise<string>;
  };
  request?: {
    url: URL | string;
  };
};

const hasKyResponse = (error: unknown): error is KyErrorLike => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

const client = ky.create({
  prefix: 'https://api.mapserv.utah.gov/api/v1/',
  headers: {
    'x-agrc-geocode-client': 'electron-api-client',
    'x-agrc-geocode-client-version': app.getVersion(),
    Referer: 'https://api-client.ugrc.utah.gov/',
  },
});

const cleanseStreet = (data: string) => {
  const replacement = ' ';

  // & -> and
  let street = data.replace('&', 'and');
  street = street.replace(INVALID_CHARS, replacement);
  street = street.replace(SPACES, replacement);

  return street.trim();
};

const cleanseZone = (data: number) => {
  let zone = data.toString().replace(INVALID_CHARS, ' ');
  zone = zone.replace(SPACES, ' ').trim();

  if (zone.length > 0 && zone[0] == '8') {
    zone = zone.slice(0, 5);
  }

  return zone;
};

const coolYourJets = () => {
  const min = 50;
  const max = 200;

  return new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));
};

let cancelled: string | null = null;
export const cancelGeocode = (status: string | null = 'cancelled') => {
  cancelled = status;
};

export const checkApiKey = async (apiKey: string) => {
  log.info(`Checking API key: ${apiKey}`);

  let response;

  try {
    response = await client
      .get(`geocode/326 east south temple street/slc`, {
        searchParams: {
          apiKey: apiKey,
        },
      })
      .json();
  } catch (error) {
    if (!hasKyResponse(error) || !error.response) {
      throw error;
    }

    const errorBody = await error.response.text();
    log.error(`Error checking api key: ${errorBody}`);
    response = errorBody ? JSON.parse(errorBody) : { status: error.response.status };
  }

  const isValid = response.status === 200;

  // trackEvent({ category: 'api-key-check', label: isValid });
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
      street: null as string | null,
      zone: null as string | null,
      url: null as string | null,
    },
    response: {
      status: 0,
      body: null as unknown,
    },
  };

  // trackEvent({ category: 'geocode', label: `${totalRows}, ${md5(filePath)}` });
  // trackEvent({ category: 'wkid', label: wkid });

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
        response = await client
          .get(`geocode/${street}/${zone}`, {
            searchParams: {
              apiKey: apiKey,
              spatialReference: wkid,
            },
          })
          .json();

        lastRequest.response = {
          status: response.status,
          body: response.body,
        };
      } catch (error) {
        log.error(`Error geocoding street [${street}] zone [${zone}]: ${error}`);

        try {
          response = hasKyResponse(error) && error.response ? await error.response.json() : { error: null };
        } catch {
          response = { error: error instanceof Error ? error.message : 'Unknown geocoding error' };
        }

        lastRequest.request.url = hasKyResponse(error) && error.request ? String(error.request.url) : null;
        lastRequest.response = {
          status: hasKyResponse(error) && error.response ? error.response.status : -1,
          body:
            typeof response === 'object' && response !== null
              ? (response as { error?: unknown; message?: unknown }).error ??
                (response as { error?: unknown; message?: unknown }).message
              : response,
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
      // trackEvent({ category: 'geocoding-cancelled', label: 'fast-fail' });
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
