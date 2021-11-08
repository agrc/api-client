const { app, ipcMain } = require('electron');
const Sentry = require('@sentry/electron');

const config = {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: app.getVersion(),
};

// clone config to make sure that we return a clean object in the handle
// init seems to tack on a bunch of defaults to it
Sentry.init({ ...config });

ipcMain.handle('getSentryConfig', () => {
  return { ...config };
});
