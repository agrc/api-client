const { ipcMain } = require('electron');
const fs = require('fs');
import { parse } from 'csv-parse';
import { CSV_PARSE_ERROR } from '../components/InvalidCsv.jsx';

export const getDataSample = async (filePath) => {
  const parser = parse({ columns: true, skipEmptyLines: true });

  try {
    const parsed = fs.createReadStream(filePath).pipe(parser);

    //* read the first line to get the file structure
    for await (const record of parsed) {
      return record;
    }
  } catch (parseError) {
    throw new Error(`${CSV_PARSE_ERROR}: {${parseError.code}} {${parseError.message}}`);
  }
};

export const getRecordCount = (filePath) => {
  return new Promise((resolve, reject) => {
    const parser = parse({ columns: true }, function (parseError, data) {
      reject(`${CSV_PARSE_ERROR}: {${parseError.code}} {${parseError.message}}`);

      resolve(data.length);
    });

    try {
      fs.createReadStream(filePath).pipe(parser);
    } catch (parseError) {
      throw new Error(`${CSV_PARSE_ERROR}: {${parseError.code}} {${parseError.message}}`);
    }
  });
};

ipcMain.handle('getSampleFromFile', (_, content) => {
  return getDataSample(content);
});
ipcMain.handle('getRecordCount', (_, content) => {
  return getRecordCount(content);
});
