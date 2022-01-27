const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('ugrc', {
  getSampleFromFile: (content) => ipcRenderer.invoke('getSampleFromFile', content),
  getRecordCount: (content) => ipcRenderer.invoke('getRecordCount', content),
  saveConfig: (content) => ipcRenderer.send('saveConfig', content),
  getConfigItem: (content) => ipcRenderer.invoke('getConfigItem', content),
  subscribeToGeocodingUpdates: (handler) => ipcRenderer.on('onGeocodingUpdate', handler),
  unsubscribeFromGeocodingUpdates: () => ipcRenderer.removeAllListeners('onGeocodingUpdate'),
  geocode: (content) => ipcRenderer.invoke('geocode', content),
  cancelGeocode: (content) => ipcRenderer.send('cancelGeocode', content),
  startDrag: (content) => ipcRenderer.send('ondragstart', content),
  checkApiKey: (content) => ipcRenderer.invoke('checkApiKey', content),
  getAppVersion: (content) => ipcRenderer.invoke('getAppVersion', content),
  getAppInfo: (content) => ipcRenderer.invoke('getAppInfo', content),
  getUserConfirmation: (content) => ipcRenderer.invoke('getUserConfirmation', content),
  isMacOS: () => process.platform === 'darwin',
  relaunchApp: () => ipcRenderer.send('relaunchApp'),
  openIssue: (content) => ipcRenderer.send('openIssue', content),
  openEmail: (content) => ipcRenderer.send('openEmail', content),
  trackEvent: (content) => ipcRenderer.send('trackEvent', content),
  trackException: (content) => ipcRenderer.send('trackException', content),
});
