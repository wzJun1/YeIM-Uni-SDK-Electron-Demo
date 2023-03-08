const {
    dialog
} = require('electron')

let onKickLogin = false;

module.exports = {

    /**
     * 监听js事件：踢出登录
     * 
     * @param {Object} ipcMain
     */
    kickLogin(ipcMain, loginWindow, mainWindow) {
        if (mainWindow == null) return;
        if (onKickLogin) return;
        onKickLogin = true;
        //监听踢出登录事件
        ipcMain.on('kick-login', (e) => {
            mainWindow.close();
            loginWindow.show();
            dialog.showMessageBox({
                type: 'info',
                title: '提醒',
                message: "您被踢下线了",
                buttons: ['我知道了']
            }).then(result => {
            }).catch(err => {
            })
        });
    },
    /**
       * 监听js事件：工具栏最小化关闭
       * 
       * @param {Object} ipcMain
       */
    toolsListener(ipcMain, loginWindow, mainWindow) {

        ipcMain.on('minimize', (e) => {
            if (mainWindow != null) {
                mainWindow.hide();
            }
            if (loginWindow != null) {
                loginWindow.hide();
            }
        });
        ipcMain.on('close', (e) => {
            if (mainWindow != null) {
                mainWindow.hide();
                mainWindow.setSkipTaskbar(true);
            }
            if (loginWindow != null) {
                loginWindow.hide();
                loginWindow.setSkipTaskbar(true);
            }
        });
    }
}
