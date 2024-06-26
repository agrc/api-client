import { ipcMain } from 'electron';
import Store from 'electron-store';

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
    wkid: {
      type: 'number',
      default: 26912,
    },
  },
});

ipcMain.handle('getConfigItem', (_, key) => {
  return store.get(key);
});

ipcMain.handle('saveConfig', (_, content) => {
  store.set(content);
});
