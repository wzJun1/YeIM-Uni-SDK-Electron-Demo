const {
	contextBridge,
	ipcRenderer
} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
	openMain: (options) => ipcRenderer.send('open-main', options),
	showMessageBox: (options) => ipcRenderer.invoke('show-dialog-message-box', options),
	setLocalStorage: (key, value) => ipcRenderer.send('set-local-storage', key, value),
	getLocalStorage: (key) => ipcRenderer.invoke('get-local-storage', key),
	setSocketStatus: (value) => ipcRenderer.send('set-socket-status', value),
	getSocketStatus: () => ipcRenderer.invoke('get-socket-status'),
	kickLogin: (key, value) => ipcRenderer.send('kick-login', key, value),
	minimize: (key, value) => ipcRenderer.send('minimize', key, value),
	close: (key, value) => ipcRenderer.send('close', key, value),
})
