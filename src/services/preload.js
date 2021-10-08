const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('ugrc', {
  getFieldsFromFile: (content) => ipcRenderer.invoke('getFieldsFromFile', content),
  getRecordCount: (content) => ipcRenderer.invoke('getRecordCount', content),
  saveConfig: (content) => ipcRenderer.send('saveConfig', content),
  getConfigItem: (content) => ipcRenderer.invoke('getConfigItem', content),
  subscribeToGeocodingUpdates: (event, arg) => ipcRenderer.on('onGeocodingUpdate', event, arg),
  unsubscribeFromGeocodingUpdates: () => ipcRenderer.removeAllListeners('onGeocodingUpdate'),
  geocode: (content) => ipcRenderer.send('geocode', content),
  cancelGeocode: (content) => ipcRenderer.send('cancelGeocode', content),
  startDrag: (content) => ipcRenderer.send('ondragstart', content),
  checkApiKey: (content) => ipcRenderer.invoke('checkApiKey', content),
  getAppVersion: (content) => ipcRenderer.invoke('getAppVersion', content),
  getAppInfo: (content) => ipcRenderer.invoke('getAppInfo', content),
  getUserConfirmation: (content) => ipcRenderer.invoke('getUserConfirmation', content),
});
