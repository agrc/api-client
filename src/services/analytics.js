const { ipcMain } = require('electron');
const machineIdSync = require('node-machine-id').machineIdSync;
const ua = require('universal-analytics');
const { is } = require('electron-util');
const id = machineIdSync();
const visitor = ua('UA-11849964-68', id);

visitor.event({ ec: 'application-open', ea: id, el: process.platform }).send();
visitor.event({ ec: 'client-version', ea: id, el: process.version }).send();

//* main thread functions
export const trackEvent = ({ category, action = id, label }) => {
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
  console.log(content);
  trackEvent(content);
});

ipcMain.on('trackException', (_, content) => {
  trackException(content);
});
