const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('ugrc', {
  saveContent: (content) => ipcRenderer.send('saveContent', content),
  apiKey: ipcRenderer.invoke('loadContent'),
});
