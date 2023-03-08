
const {
    dialogListener
} = require("./listen/dialog");

const {
    getStorageListener,
    setStorageListener,
    setSocketStatus,
    getSocketStatus
} = require("./listen/store");


const {
    kickLogin,
    toolsListener
} = require("./listen/settings");

module.exports = class eventBus {

    constructor(ipcMain, store, loginWindow, mainWindow) {
        //初始化[JS调用提示框]监听事件
        dialogListener(ipcMain);
        //初始化[设置程序本地缓存]监听事件
        setStorageListener(ipcMain, store);
        //初始化[获取程序本地缓存]监听事件
        getStorageListener(ipcMain, store);
        //初始化[设置Socket状态]监听事件
        setSocketStatus(ipcMain);
        //初始化[获取Socket状态]监听事件
        getSocketStatus(ipcMain);
    }

    windowListener(ipcMain, loginWindow, mainWindow) {
        //初始化[退出登录]监听事件
        kickLogin(ipcMain, loginWindow, mainWindow);
        //初始化[最小化关闭]监听事件
        toolsListener(ipcMain, loginWindow, mainWindow);
    }
};
