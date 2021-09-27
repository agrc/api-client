const fs = require('fs');
const parse = require('csv-parse');
const got = require('got');
const { readPackageUpAsync } = require('read-pkg-up');
const { ipcMain } = require('electron');

export const getFields = async (filePath) => {
  const parser = fs.createReadStream(filePath).pipe(parse({ columns: true, skipEmptyLines: true }));

  //* read the first line to get the file structure
  for await (const record of parser) {
    return Object.keys(record);
  }
};

export const getRecordCount = (filePath) => {
  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(filePath);
    const parser = parse({ columns: true }, function (err, data) {
      if (err) {
        reject(err);

        return;
      }

      resolve(data.length);
    });
    rs.pipe(parser);
  });
};

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

export const geocode = async (event, { abortSignal, filePath, fields, apiKey }) => {
  const parser = fs.createReadStream(filePath).pipe(parse({ columns: true, skipEmptyLines: true }));

  const packageInfo = await readPackageUpAsync();
  let totalRows = await getRecordCount(filePath);
  let rowsProcessed = 0;
  let totalScore = 0;
  let failures = 0;

  for await (const record of parser) {
    if (abortSignal.aborted) {
      return;
    }

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
            'x-agrc-geocode-client-version': packageInfo.version,
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
      const { score } = result;
      totalScore += score;
    }

    rowsProcessed++;

    event.reply('onGeocodingUpdate', {
      totalRows,
      rowsProcessed,
      averageScore: Math.round(totalScore / (rowsProcessed - failures)),
      activeMatchRate: (rowsProcessed - failures) / rowsProcessed,
    });

    await coolYourJets();
  }
};

ipcMain.handle('getFieldsFromFile', (_, content) => {
  return getFields(content);
});
ipcMain.handle('getRecordCount', (_, content) => {
  return getRecordCount(content);
});
ipcMain.on('geocode', (event, content) => {
  return geocode(event, content);
});