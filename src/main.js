require('./services/sentry');
const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
require('./services/errors');
require('./services/config');
require('./services/csv');
require('./services/geocode');
const { enforceMacOSAppLocation, is } = require('electron-util');
const { trackException } = require('./services/analytics');

require('update-electron-app')({
  updateInterval: '1 hour',
  logger: require('electron-log'),
  notifyUser: false,
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  enforceMacOSAppLocation();

  const mainWindowState = windowStateKeeper({
    defaultWidth: 700,
    defaultHeight: 1000,
    fullScreen: false,
  });

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    minWidth: 525,
    minHeight: 500,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: 'rgba(0, 0, 0, 0)',
    },
    webPreferences: {
      preload: path.join(__dirname, 'services', 'preload.js'),
      sandbox: true,
      nodeIntegration: false,
      contextIsolation: true,
      autoHideMenuBar: true,
    },
  });

  mainWindowState.manage(mainWindow);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (is.development) {
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
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('web-contents-created', (_, contents) => {
  const isSafeForExternalOpen = (urlString) => {
    const safeHosts = [
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
      trackException(`non-safe url request: ${urlString}`, false);

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
