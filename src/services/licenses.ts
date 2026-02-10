import { app, ipcMain } from 'electron';
import { readFile } from 'fs/promises';
import path from 'path';

ipcMain.handle('getLicenses', async () => {
  try {
    // In both dev and production, assets are copied relative to __dirname
    const licensesPath = app.isPackaged
      ? path.join(process.resourcesPath, 'app.asar', '.vite/build/assets/licenses.txt')
      : path.join(__dirname, 'assets/licenses.txt');

    const data = await readFile(licensesPath, 'utf-8');

    return data;
  } catch (error) {
    console.warn('Error reading licenses:', error);

    return 'license information is unavailable';
  }
});
