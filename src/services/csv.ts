import { parse } from 'csv-parse';
import { ipcMain } from 'electron';
import fs from 'fs';
import { CSV_PARSE_ERROR } from '../components/InvalidCsv';

export const validateWithStats = (filePath, options) => {
  return new Promise((resolve, reject) => {
    const parser = parse({ columns: true, skipEmptyLines: true, ...options }, function (parseError, data) {
      if (parseError) {
        reject(`${CSV_PARSE_ERROR}: {${parseError.code}} {${parseError.message}}`);

        return;
      }

      if (data.length === 0) {
        reject(new Error(`${CSV_PARSE_ERROR}: {INVALID_OR_EMPTY_FILE} {No records found in your file.}`));
      }

      resolve({ firstRecord: data[0], totalRecords: data.length });
    });

    try {
      fs.createReadStream(filePath).pipe(parser);
    } catch (parseError) {
      throw new Error(`${CSV_PARSE_ERROR}: {${parseError.code}} {${parseError.message}}`);
    }
  });
};

ipcMain.handle('validateWithStats', (_, content) => {
  return validateWithStats(content);
});

ipcMain.handle('getCsvColumns', (_, content) => {
  return validateWithStats(content, { from: 0, to: 1 });
});
