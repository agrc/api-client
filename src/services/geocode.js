const { app, ipcMain, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');
const got = require('got');
const stringify = require('csv-stringify');
const getFields = require('./csv').getFields;
const getRecordCount = require('./csv').getRecordCount;

const SPACES = / +/;
const INVALID_CHARS = /[^a-zA-Z0-9]/;

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

let cancelled = false;
export const cancelGeocode = () => {
  cancelled = true;
};

export const checkApiKey = async (apiKey) => {
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
      timeout: 5000,
    }).json();
  } catch (error) {
    if (error?.response?.body) {
      response = JSON.parse(error.response.body);
    } else {
      throw error;
    }
  }

  return response.status === 200;
};

const output = 'ugrc_geocode_results.csv';
export const geocode = async (event, { filePath, fields, apiKey }) => {
  cancelled = false;
  const parser = fs.createReadStream(filePath).pipe(parse({ columns: true, skipEmptyLines: true }));
  const columns = await getFields(filePath);
  const writer = fs.createWriteStream(path.join(app.getPath('userData'), output));
  const stringifier = stringify({ columns: [...columns, 'x', 'y', 'score', 'match_address'], header: true });
  stringifier.pipe(writer);

  let totalRows = await getRecordCount(filePath);
  let rowsProcessed = 0;
  let totalScore = 0;
  let failures = 0;

  for await (const record of parser) {
    if (cancelled) {
      event.reply('onGeocodingUpdate', {
        totalRows,
        rowsProcessed,
        averageScore: Math.round(totalScore / (rowsProcessed - failures)) || 0,
        activeMatchRate: (rowsProcessed - failures) / rowsProcessed || 0,
        status: 'cancelled',
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
      try {
        response = await got(`geocode/${street}/${zone}`, {
          headers: {
            'x-agrc-geocode-client': 'electron-api-client',
            'x-agrc-geocode-client-version': app.getVersion(),
            Referer: 'https://api-client.ugrc.utah.gov/',
          },
          searchParams: {
            apiKey: apiKey,
          },
          prefixUrl: 'https://api.mapserv.utah.gov/api/v1/',
          timeout: 5000,
        }).json();
      } catch (error) {
        response = JSON.parse(error.response.body);

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

    event.reply('onGeocodingUpdate', {
      totalRows,
      rowsProcessed,
      averageScore: Math.round(totalScore / (rowsProcessed - failures)),
      activeMatchRate: (rowsProcessed - failures) / rowsProcessed,
      status: 'running',
    });

    await coolYourJets();
  }

  stringifier.end();

  event.reply('onGeocodingUpdate', {
    totalRows,
    rowsProcessed,
    averageScore: Math.round(totalScore / (rowsProcessed - failures)),
    activeMatchRate: (rowsProcessed - failures) / rowsProcessed,
    status: 'complete',
  });
};

ipcMain.handle('checkApiKey', (_, content) => {
  return checkApiKey(content);
});
ipcMain.on('geocode', (event, content) => {
  return geocode(event, content);
});
ipcMain.on('cancelGeocode', () => {
  return cancelGeocode();
});
ipcMain.on('ondragstart', (event) => {
  event.sender.startDrag({
    file: path.join(app.getPath('userData'), output),
    icon: path.resolve(__dirname, 'assets', 'draganddrop.png'),
  });
});
