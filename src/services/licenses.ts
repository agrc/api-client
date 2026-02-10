import { app, ipcMain } from 'electron';
import { readFile } from 'fs/promises';
import { generateLicenseFile } from 'generate-license-file';
import path from 'path';

ipcMain.handle('getLicenses', async () => {
  try {
    const packageJsonPath = path.join(__dirname, '../../package.json');
    const configPath = path.join(__dirname, '../../glf.json');
    const tempOutputPath = path.join(app.getPath('temp'), 'licenses-temp.txt');

    await generateLicenseFile(packageJsonPath, tempOutputPath, configPath);

    const licensesContent = await readFile(tempOutputPath, 'utf-8');

    return licensesContent;
  } catch (error) {
    console.error('Error generating licenses:', error);
    return 'license information is unavailable';
  }
});
