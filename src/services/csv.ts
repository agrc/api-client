import { parse } from 'csv-parse';
import { app, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import { CSV_PARSE_ERROR } from '../components/InvalidCsv';

export const validateWithStats = (filePath: string, options: Record<string, unknown> = {}) => {
  return new Promise((resolve, reject) => {
    if (!filePath || filePath.trim() === '') {
      reject(new Error(`${CSV_PARSE_ERROR}: {INVALID_FILE_PATH} {No local file path was provided.}`));

      return;
    }

    const parser = parse({ columns: true, skipEmptyLines: true, ...options });
    const rows: Record<string, unknown>[] = [];
    let settled = false;

    const rejectOnce = (error: Error) => {
      if (settled) {
        return;
      }

      settled = true;
      reject(error);
    };

    const resolveOnce = (value: unknown) => {
      if (settled) {
        return;
      }

      settled = true;
      resolve(value);
    };

    parser.on('readable', () => {
      let record: Record<string, unknown> | null;

      while ((record = parser.read() as Record<string, unknown> | null) !== null) {
        rows.push(record);
      }
    });

    parser.on('error', (parseError: { code?: string; message?: string }) => {
      rejectOnce(
        new Error(`${CSV_PARSE_ERROR}: {${parseError.code}} {${parseError.message ?? 'Unknown parse error'}}`),
      );
    });

    parser.on('end', () => {
      if (rows.length === 0) {
        rejectOnce(new Error(`${CSV_PARSE_ERROR}: {INVALID_OR_EMPTY_FILE} {No records found in your file.}`));

        return;
      }

      resolveOnce({ firstRecord: rows[0], totalRecords: rows.length });
    });

    try {
      const stream = fs.createReadStream(filePath);

      stream.on('error', (streamError: NodeJS.ErrnoException) => {
        rejectOnce(
          new Error(
            `${CSV_PARSE_ERROR}: {FILE_READ_ERROR} {${streamError.message ?? 'Unable to read file from disk.'}}`,
            {
              cause: streamError,
            },
          ),
        );
      });

      stream.pipe(parser);
    } catch (parseError) {
      if (parseError instanceof Error) {
        rejectOnce(new Error(`${CSV_PARSE_ERROR}: {UNKNOWN} {${parseError.message}}`, { cause: parseError }));

        return;
      }

      rejectOnce(new Error(`${CSV_PARSE_ERROR}: {UNKNOWN} {Failed to read the selected file.}`));
    }
  });
};

ipcMain.handle('validateWithStats', (_, content) => {
  return validateWithStats(content);
});

ipcMain.handle('getCsvColumns', (_, content) => {
  return validateWithStats(content, { from: 0, to: 1 });
});

ipcMain.handle('saveDroppedFile', async (_, content) => {
  const droppedFile = content as {
    name?: string;
    bytes?: number[] | Uint8Array | ArrayBuffer;
  };

  if (!droppedFile?.bytes) {
    throw new Error(`${CSV_PARSE_ERROR}: {INVALID_FILE_DATA} {No file bytes were provided for the dropped file.}`);
  }

  const bytes =
    droppedFile.bytes instanceof Uint8Array
      ? droppedFile.bytes
      : droppedFile.bytes instanceof ArrayBuffer
        ? new Uint8Array(droppedFile.bytes)
        : new Uint8Array(droppedFile.bytes);

  if (bytes.length === 0) {
    throw new Error(`${CSV_PARSE_ERROR}: {INVALID_OR_EMPTY_FILE} {No records found in your file.}`);
  }

  const importDirectory = path.join(app.getPath('userData'), 'imports');
  await fs.promises.mkdir(importDirectory, { recursive: true });

  const providedName = droppedFile.name ?? 'dropped-file.csv';
  const extension = '.csv';
  const baseName = path
    .basename(providedName, path.extname(providedName))
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const safeName = baseName.length > 0 ? baseName : 'dropped-file';
  const filePath = path.join(importDirectory, `${safeName}-${Date.now()}${extension}`);

  await fs.promises.writeFile(filePath, Buffer.from(bytes));

  return filePath;
});
