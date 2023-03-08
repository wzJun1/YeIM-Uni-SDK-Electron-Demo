import { createSSRApp } from "vue";
import * as Pinia from 'pinia';

// @ts-ignore
import { YeIMUniSDK, YeIMUniSDKDefines } from "yeim-uni-sdk";
import App from "./App.vue";


//挂载YeIM预定义常量到uni
// @ts-ignore
uni.$YeIMUniSDKDefines = YeIMUniSDKDefines;
//实例化YeIMUniSDK，并挂载到uni
// @ts-ignore
uni.$YeIM = YeIMUniSDK.init({
	baseURL: 'http://192.168.110.195:10010',
	socketURL: 'ws://192.168.110.195:10010/im',
	logLevel: 0, // SDK日志等级，0 = 打印全部日志， 1 = 打印重要日志，2 = 不打印日志
	reConnectInterval: 3000, // 断线重连时间间隔（遇到网络波动，IM服务端可能会断线，此时需要重新连接到服务端），单位：毫秒
	reConnectTotal: 0, // 最大重连次数，0不限制一直重连
	heartInterval: 30000, //心跳时间间隔（默认30秒），单位：毫秒
});


export function createApp() {
	const app = createSSRApp(App);
	app.use(Pinia.createPinia());
	return {
		app,
		Pinia
	};
}
