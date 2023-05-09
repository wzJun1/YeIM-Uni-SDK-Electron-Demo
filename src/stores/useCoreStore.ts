import { defineStore } from "pinia";
import type { SDKResultModel } from "@/entity/SDKResultModel";
import type { UserInfo } from "@/entity/Conversation";
import type { Conversation } from "@/entity/Conversation";
import { YeIMUniSDK, YeIMUniSDKDefines } from "yeim-uni-sdk";


export const useCoreStore = defineStore("IMCore", {
	state: () => {
		return {
			isLogged: false,
			userInfo: {} as UserInfo | null,
			currentConversaton: {} as Conversation || null,
			conversationList: [] as Array<Conversation>,
			startListener: false,
		};
	},
	actions: {
		login(userId: string, token: string, expire: number) {
			YeIMUniSDK.getInstance()?.connect({
				userId: userId,
				token: token,
				success: (response: SDKResultModel) => {
					if (response.code === 200) {
						// 存到状态中
						this.userInfo = response.data as UserInfo;
						// @ts-ignore
						this.userInfo.expireTime = expire;
						// @ts-ignore
						this.userInfo.token = token;
						this.isLogged = true;
						this.listener();
						// @ts-ignore
						window.electronAPI.setSocketStatus(true);
					} else {
						this.isLogged = false;
					}
				},
				fail: (err: any) => {
					console.log(err);
				}
			});
		},
		listener() {
			if (this.startListener) return;
			this.startListener = true;

			YeIMUniSDK.getInstance()?.addEventListener(YeIMUniSDKDefines.EVENT.CONVERSATION_LIST_CHANGED, (list) => {
				console.log("监听会话列表更新:");
				console.log(list);
				this.conversationList = list;
			})
			// 监听用户被踢下线
			YeIMUniSDK.getInstance()?.addEventListener(YeIMUniSDKDefines.EVENT.KICKED_OUT, () => {
				console.log("用户被踢下线");
				this.kickOut();
			});
		},
		kickOut() {
			YeIMUniSDK.getInstance()?.disConnect();
			this.isLogged = false;
			this.userInfo = null;
			this.currentConversaton = {} as Conversation || null;
			this.conversationList = [];
			// @ts-ignore
			window.electronAPI.setSocketStatus(false);
			// @ts-ignore
			window.electronAPI.kickLogin();
		}
	}
});
