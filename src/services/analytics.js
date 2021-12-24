const machineIdSync = require('node-machine-id').machineIdSync;
const ua = require('universal-analytics');

const id = machineIdSync();
const visitor = ua('UA-11849964-68', id);

visitor.event({ ec: 'application-open', ea: id, el: process.platform }).send();

export const trackEvent = ({ category, action = id, label }) => {
  visitor
    .event({
      ec: category,
      ea: action,
      el: label,
    })
    .send();
};
