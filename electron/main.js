const {
	app,
	BrowserWindow,
	Tray,
	Menu,
	nativeImage,
	ipcMain
} = require("electron");
const electronStore = require('electron-store');
const eventBus = require('./src/eventBus/eventBus');

//本地缓存
const store = new electronStore();

// 登录框
let loginWindow = null;

//聊天主界面
let mainWindow = null;

//JS事件监听
const event = new eventBus(ipcMain, store);

let tray = null

/**
 * 创建登录框
 */
const createLoginWindow = () => {

	loginWindow = new BrowserWindow({
		width: 320,
		height: 450,
		resizable: false,
		center: true, // 窗口居中
		transparent: false,
		titleBarStyle: "hidden",
		show: false,
		maximizable: false,
		webPreferences: {
			preload: __dirname + "/preload.js",
		},
	});

	// 关闭默认菜单
	loginWindow.setMenu(null);

	//loginWindow.loadURL("http://localhost:5173");
	loginWindow.loadFile("dist/build/h5/index.html");

	loginWindow.once("ready-to-show", () => {
		setTimeout(() => {
			loginWindow.show();
		}, 100);
	});

	ipcMain.on("open-main", (e, options) => {
		store.set("user-login-cache", options);
		createMainWindow();
	});

	loginWindow.on("close", (event) => {
		console.log("emit loginWindow close");
		loginWindow.hide();
		event.preventDefault();
	});

	createTray();
};

/**
 * 创建聊天主界面
 */
function createMainWindow() {

	mainWindow = new BrowserWindow({
		width: 1000,
		height: 750,
		center: true, // 窗口居中
		titleBarStyle: "hidden",
		minWidth: 950,
		minHeight: 650,
		transparent: true,
		show: false,
		maximizable: false,
		webPreferences: {
			preload: __dirname + "/preload.js",
		},
	});
	// 关闭默认菜单
	mainWindow.setMenu(null);
	//mainWindow.loadURL("http://localhost:5173/#/pages/main/index");
	mainWindow.loadFile("dist/build/h5/index.html", {
		hash: "/pages/main/index"
	});
	mainWindow.once("ready-to-show", () => {
		loginWindow.hide();
		setTimeout(() => {
			mainWindow.show();
		}, 200);
	});

	mainWindow.on("close", (event) => {
		console.log("emit mainWindow close");
		mainWindow.hide();
		event.preventDefault();
	});

	event.windowListener(ipcMain, loginWindow, mainWindow);
}

function createTray() {
	// 新建托盘
	const icon = nativeImage.createFromPath(__dirname + '/src/favicon.png')
	tray = new Tray(icon);
	// 托盘名称
	tray.setToolTip('Electron Tray');
	// 托盘菜单
	const contextMenu = Menu.buildFromTemplate([{
		label: '显示主界面',
		click: () => {
			if (mainWindow != null) {
				mainWindow.show();
				mainWindow.setSkipTaskbar(false);
			} else {
				loginWindow.show();
				loginWindow.setSkipTaskbar(false);
			}
		}
	},
	{
		label: '退出程序',
		click: () => { app.exit(); }
	}
	]);
	// 载入托盘菜单
	tray.setContextMenu(contextMenu);

}

app.whenReady().then(() => {
	createLoginWindow();
});

app.on("activate", () => {
	if (mainWindow != null) {
		mainWindow.show();
	} else {
		loginWindow.show();
	}
});

app.on("window-all-closed", () => {
	//app.quit();
});

app.on("before-quit", () => {
	app.exit();
});

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
