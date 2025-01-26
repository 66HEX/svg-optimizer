const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    selectFiles: () => ipcRenderer.invoke('select-files'),
    selectSaveDirectory: () => ipcRenderer.invoke('select-save-directory'),
    optimizeSvgFiles: (files, options, saveDir) =>
        ipcRenderer.invoke('optimize-svg-files', files, options, saveDir)
})