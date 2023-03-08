let socketConnected = false;

module.exports = {

	/**
	 * 监听设置程序本地缓存
	 * 
	 * @param {Object} ipcMain
	 * @param {Object} store
	 */
	setStorageListener(ipcMain, store) {
		ipcMain.on('set-local-storage', (event, key, value) => {
			if (value == null) {
				store.delete(key);
			} else {
				store.set(key, value);
			}
		});
	},

	/**
	 * 监听获取程序本地缓存
	 * 
	 * @param {Object} ipcMain
	 * @param {Object} store
	 */
	getStorageListener(ipcMain, store) {
		ipcMain.handle('get-local-storage', async (event, key) => {
			return store.get(key);
		});
	},

	setSocketStatus(ipcMain) {
		//监听常规消息提示框
		ipcMain.on('set-socket-status', async (event, value) => {
			socketConnected = value;
		});
	},

	getSocketStatus(ipcMain) {
		//监听常规消息提示框
		ipcMain.handle('get-socket-status', async (event) => {
			return socketConnected;
		});
	}

}
