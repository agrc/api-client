const fs = require('fs');
const parse = require('csv-parse');

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
