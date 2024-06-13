import { ipcMain } from 'electron';
import machineId from 'node-machine-id';
import Analytics from 'electron-google-analytics4';

const { machineIdSync } = machineId;
const id = machineIdSync();
const visitor = new Analytics(process.env.GA4_ID, process.env.GA4_SECRET, id);

visitor.event({ ec: 'application-open', ea: id, el: process.platform });
visitor.event({ ec: 'client-version', ea: id, el: process.version });

//* main thread functions
export const trackEvent = ({ category, action = id, label }) => {
  visitor.event({
    ec: category,
    ea: action,
    el: label,
  });
};

//* renderer events
ipcMain.on('trackEvent', (_, content) => {
  console.log(content);
  trackEvent(content);
});
