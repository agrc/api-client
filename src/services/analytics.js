const { app, ipcMain } = require('electron');
const machineIdSync = require('node-machine-id').machineIdSync;
const ua = require('universal-analytics');
const { is } = require('electron-util');
const id = machineIdSync();
const visitor = ua('UA-11849964-68', id);

if (!is.development) {
  visitor.event({ ec: 'application-open', ea: id, el: process.platform }).send();
  visitor.event({ ec: 'client-version', ea: id, el: app.getVersion() }).send();
}

//* main thread functions
export const trackEvent = ({ category, action = id, label }) => {
  if (is.development) {
    console.log('event tracked', { category, action, label });

    return;
  }

  visitor
    .event({
      ec: category,
      ea: action,
      el: label,
    })
    .send();
};

export const trackException = (ex, fatal = false) => {
  if (is.development) {
    console.error(ex);

    return;
  }

  visitor.exception(ex, fatal).send();
};

//* renderer events
ipcMain.on('trackEvent', (_, content) => {
  trackEvent(content);
});

ipcMain.on('trackException', (_, content) => {
  trackException(content);
});
