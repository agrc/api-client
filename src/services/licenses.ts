import { app, ipcMain } from 'electron';
import log from 'electron-log';
import { readFile } from 'fs/promises';
import path from 'path';

ipcMain.handle('getLicenses', async () => {
  try {
    // Electron's fs reads transparently from asar archives
    const licensesPath = path.join(__dirname, 'assets/licenses.txt');

    log.info('Attempting to read licenses from:', licensesPath);
    log.info('App isPackaged:', app.isPackaged);
    log.info('__dirname:', __dirname);

    const data = await readFile(licensesPath, 'utf-8');
    log.info('Successfully read licenses.txt');

    return data;
  } catch (error) {
    log.error('Error reading licenses:', error);
    log.error('Attempted path:', path.join(__dirname, 'assets/licenses.txt'));

    return 'license information is unavailable';
  }
});
