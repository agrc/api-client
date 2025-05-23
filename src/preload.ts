import { contextBridge, ipcRenderer, webUtils } from 'electron';

contextBridge.exposeInMainWorld('ugrc', {
  webFilePath: (file) => webUtils.getPathForFile(file),

  validateWithStats: (content) => ipcRenderer.invoke('validateWithStats', content),
  getCsvColumns: (content) => ipcRenderer.invoke('getCsvColumns', content),
  saveConfig: (content) => ipcRenderer.invoke('saveConfig', content),
  getConfigItem: (content) => ipcRenderer.invoke('getConfigItem', content),
  geocode: (content) => ipcRenderer.invoke('geocode', content),
  cancelGeocode: (content) => ipcRenderer.invoke('cancelGeocode', content),
  startDrag: (content) => ipcRenderer.invoke('onDragStart', content),
  checkApiKey: (content) => ipcRenderer.invoke('checkApiKey', content),
  getAppVersion: (content) => ipcRenderer.invoke('getAppVersion', content),
  getAppInfo: (content) => ipcRenderer.invoke('getAppInfo', content),
  getUserConfirmation: (content) => ipcRenderer.invoke('getUserConfirmation', content),

  subscribeToGeocodingUpdates: (handler) => ipcRenderer.on('onGeocodingUpdate', handler),
  unsubscribeFromGeocodingUpdates: () => ipcRenderer.removeAllListeners('onGeocodingUpdate'),

  isMacOS: () => process.platform === 'darwin',

  relaunchApp: () => ipcRenderer.send('relaunchApp'),
  openIssue: (content) => ipcRenderer.send('openIssue', content),
  openEmail: (content) => ipcRenderer.send('openEmail', content),

  trackEvent: (content) => ipcRenderer.send('trackEvent', content),
});
