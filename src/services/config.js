const { ipcMain } = require('electron');
const Store = require('electron-store');

const store = new Store({
  schema: {
    apiKey: {
      type: 'string',
      maxLength: 19,
      minLength: 19,
    },
    streetFields: {
      type: 'array',
      items: {
        type: 'string',
      },
      default: ['street', 'address', 'add', 'fulladd'],
    },
    zoneFields: {
      type: 'array',
      items: {
        type: 'string',
      },
      default: ['zone', 'zip', 'zip5', 'zipcode', 'zip_code', 'city'],
    },
  },
});

ipcMain.handle('getConfigItem', (_, key) => {
  return store.get(key);
});

ipcMain.on('saveConfig', (_, content) => {
  store.set(content);
});
