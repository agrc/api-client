import path from 'node:path';
import url from 'node:url';
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import windowStateKeeper from 'electron-window-state';
import { updateElectronApp } from 'update-electron-app';
import { enforceMacOSAppLocation, isDev } from 'electron-util/main';
import logger from 'electron-log/main';
import ElectronSquirrelStartup from 'electron-squirrel-startup';

import './services/errors.js';
import './services/config.js';
import './services/csv.js';
import './services/geocode.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

updateElectronApp({
  updateInterval: '1 hour',
  logger: logger,
  notifyUser: false,
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (ElectronSquirrelStartup) {
  app.quit();
}

const createWindow = () => {
  enforceMacOSAppLocation();

  const mainWindowState = windowStateKeeper({
    width: 700,
    height: 1000,
    fullScreen: false,
  });

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    ...mainWindowState,
    x: mainWindowState.x,
    y: mainWindowState.y,
    minWidth: 525,
    minHeight: 500,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: 'rgba(0, 0, 0, 0)',
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      sandbox: true,
      nodeIntegration: false,
      contextIsolation: true,
      autoHideMenuBar: true,
      spellcheck: false,
    },
  });

  mainWindowState.manage(mainWindow);

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  ipcMain.handle('getUserConfirmation', (_, json) => {
    const { message, detail } = JSON.parse(json);
    const buttonIndex = dialog.showMessageBoxSync(mainWindow, {
      message,
      detail,
      title: 'Confirm Cancellation',
      type: 'warning',
      buttons: ['Yes', 'Cancel'],
      defaultId: 1,
      cancelId: 1,
    });

    return buttonIndex === 0;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
app.on('web-contents-created', (_, contents) => {
  const isSafeForExternalOpen = (urlString) => {
    const safeHosts = [
      'gis.utah.gov',
      'github.com',
      'api.mapserv.utah.gov',
      'developer.mapserv.utah.gov',
      'agrc-status.netlify.app',
      'o1150892.ingest.sentry.io',
    ];
    try {
      const url = new URL(urlString);
      if (url.protocol === 'mailto:') {
        return true;
      }

      if (!url.protocol === 'https:' || !safeHosts.includes(url.hostname)) {
        return false;
      }

      return true;
    } catch (e) {
      console.error(`non-safe url request: ${urlString}`, false);

      return false;
    }
  };

  contents.setWindowOpenHandler(({ url }) => {
    // Ask the operating system
    // to open this event's url in the default browser.
    //
    // See the following item for considerations regarding what
    // URLs should be allowed through to shell.openExternal.
    if (isSafeForExternalOpen(url)) {
      setImmediate(() => {
        shell.openExternal(url);
      });
    }

    return { action: 'deny' };
  });

  // our app uses all internal navigation. prevent all navigation requests.
  contents.on('will-navigate', (event) => {
    event.preventDefault();
  });
});

ipcMain.handle('getAppVersion', () => {
  return app.getVersion();
});

ipcMain.handle('getAppInfo', () => {
  return {
    applicationName: 'UGRC API Client',
    applicationVersion: app.getVersion(),
    version: process.versions.electron,
    website: 'https://api.mapserv.utah.gov',
    repo: 'https://github.com/agrc/api-client',
  };
});
