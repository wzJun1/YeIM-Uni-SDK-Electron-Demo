const {
	dialog
} = require('electron')

/**
 * 调用原生提示框
 * 
 * @param {Object} e
 * @param {Object} options
 */
async function showMessageBox(e, options) {
	return dialog.showMessageBox(options);
}

module.exports = {

	/**
	 * 监听js事件：调用原生提示框
	 * 
	 * @param {Object} ipcMain
	 */
	dialogListener(ipcMain) {
		//监听常规消息提示框
		ipcMain.handle('show-dialog-message-box', showMessageBox);
	},
}
