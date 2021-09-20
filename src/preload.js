const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('ugrc', {
  getFieldsFromFile: (content) => ipcRenderer.invoke('getFieldsFromFile', content),
  getRecordCount: (content) => ipcRenderer.invoke('getRecordCount', content),
  saveConfig: (content) => ipcRenderer.send('saveConfig', content),
  getConfigItem: (content) => ipcRenderer.invoke('getConfigItem', content),
});
