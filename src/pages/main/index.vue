<template>
	<view class="ele-container" @mouseup="mouseup" @mousemove="mousemove">

		<view class="ele-windows-tools" v-if="ifWin">
			<view class="ele-action">
				<view class="ele-action-item" @click="minimize">
					<i class="yeim-ele-icon yeim-ele-iconwinfo-icon-zuixiaohua"></i>
				</view>
				<view class="ele-action-item" @click="close">
					<i class="yeim-ele-icon yeim-ele-iconwinfo-icon-guanbi"></i>
				</view>
			</view>
		</view>

		<view class="ele-chat-navbar" :style="ifWin ? 'padding-top: 0px' : ''"
			v-show="coreStore.currentConversaton?.conversationId">
			<view class="ele-title">
				{{ coreStore.currentConversaton?.groupInfo ? coreStore.currentConversaton?.groupInfo.name :
					coreStore.currentConversaton?.userInfo?.nickname }}
			</view>
			<view class="ele-action">
				<view class="ele-action-item" @click="developTips">
					<i class="yeim-ele-icon yeim-ele-icondianhua1 font-size-25"></i>
				</view>
				<view class="ele-action-item" @click="developTips">
					<i class="yeim-ele-icon yeim-ele-iconzhibo"></i>
				</view>
				<view class="ele-action-item" @click="developTips">
					<i class="yeim-ele-icon yeim-ele-iconshangchuan"></i>
				</view>
				<view class="ele-action-item margin-left-30" @click="developTips">
					<i class="yeim-ele-icon yeim-ele-icongengduo"></i>
				</view>
			</view>
		</view>

		<view class="ele-message-view" v-show="coreStore.currentConversaton?.conversationId">
			<message ref="messageLayout" class="ele-message" />
		</view>

		<view ref="eleFooterSeparator" class="ele-footer-separator" @mousedown="mousedown"></view>

		<view :style="{ height: footerHeight + 'px' }" class="ele-footer"
			v-show="coreStore.currentConversaton?.conversationId">
			<view class="ele-footer-toolbar">
				<view class="ele-action">
					<view class="ele-action-item" @click="developTips">
						<i class="yeim-ele-icon yeim-ele-iconshequ"></i>
					</view>
					<view class="ele-action-item" @click="sendImageMessage">
						<i class="yeim-ele-icon yeim-ele-icontupian"></i>
					</view>
					<view class="ele-action-item" @click="sendVideoMessage">
						<i class="yeim-ele-icon yeim-ele-iconxiangji"></i>
					</view>
					<view class="ele-action-item" @click="developTips">
						<i class="yeim-ele-icon yeim-ele-icondingwei"></i>
					</view>
					<view class="ele-action-item" @click="developTips">
						<i class="yeim-ele-icon yeim-ele-iconyuyin margin-left-30"></i>
					</view>
				</view>
			</view>

			<view class="ele-footer-input">
				<textarea class="ele-textarea" confirm-type="send" :confirm-hold="true" v-model="textArea"
					@confirm="sendTextMessage" />
			</view>
		</view>

		<view class="ele-empty" v-show="!coreStore.currentConversaton?.conversationId">
			<image src="../../static/images/logo_gray_icon.png"></image>
		</view>

	</view>
</template>

<script setup lang="ts">
import {
	ref
} from "vue";

import {
	onLoad
} from "@dcloudio/uni-app"


import message from './message/index.vue'

import {
	useCoreStore
} from '@/stores/useCoreStore'
import { YeIMUniSDK } from "yeim-uni-sdk";
const coreStore = useCoreStore();

const ifWin = ref(false);

const messageLayout = ref();

const footerHeight = ref(180);

const moveable = ref(false);

const initY = ref(0);

const textArea = ref("");

const sendTextMessage = () => {
	if (textArea.value) {
		uni.chooseImage()
		// @ts-ignore
		let message = YeIMUniSDK.getInstance()?.createTextMessage({
			toId: coreStore.currentConversaton.conversationId,
			conversationType: coreStore.currentConversaton.type,
			body: {
				text: textArea.value
			}
		});
		// @ts-ignore
		YeIMUniSDK.getInstance()?.sendMessage({
			message: message,
			success: (res: any) => {
				uni.$emit('onInsertMessageList', res.data);
				console.log(res)
			},
			fail: (err: any) => {
				console.log(err)
				// 发送失败 
			}
		});
		textArea.value = "";
	}
}

const sendImageMessage = () => {
	uni.chooseImage({
		count: 1,
		sizeType: ['original', 'compressed'],
		sourceType: ['album'],
		success: async (res) => {

			//获取图片信息
			let imageInfo = await uni.getImageInfo({
				src: res.tempFilePaths[0]
			})
			console.log(imageInfo)

			// 创建图片消息
			let message = YeIMUniSDK.getInstance()?.createImageMessage({
				toId: coreStore.currentConversaton.conversationId,
				conversationType: coreStore.currentConversaton.type,
				body: {
					file: {
						tempFilePath: res.tempFilePaths[0], //本地图片临时路径
						width: imageInfo.width, //图片宽度
						height: imageInfo.height //图片高度
					}
				}
			});

			// 发送消息
			YeIMUniSDK.getInstance()?.sendMessage({
				message: message,
				success: (res: any) => {
					console.log(res);
					uni.$emit('onInsertMessageList', res.data);
				},
				fail: (err: any) => {
					console.log(err)
				}
			});
		}
	});
}

const sendVideoMessage = () => {
	uni.chooseVideo({
		sourceType: ['camera', 'album'],
		success: (res) => {
			console.log(res)
			// 创建小视频消息
			let message = YeIMUniSDK.getInstance()?.createVideoMessage({
				toId: coreStore.currentConversaton.conversationId,
				conversationType: coreStore.currentConversaton.type,
				body: {
					file: {
						tempFilePath: res.tempFilePath, //本地小视频文件临时路径
						width: res.width, //视频宽度
						height: res.height, //视频高度
						duration: Math.ceil(res.duration) // 视频时长，单位：秒
					}
				}
			});

			// 发送消息
			YeIMUniSDK.getInstance()?.sendMessage({
				message: message,
				success: (res: any) => {
					console.log(res);
					uni.$emit('onInsertMessageList', res.data);
				},
				fail: (err: any) => {
					console.log(err)
				}
			});
		}
	});
}

const mousedown = (e: any) => {
	initY.value = e.pageY;
	moveable.value = true;
}

const windowHeight = uni.getSystemInfoSync().windowHeight;

const mousemove = (e: any) => {
	if (moveable.value) {
		let pageY = e.pageY; //鼠标当前Y轴位置 
		let height = windowHeight - pageY;
		if (height <= 500 && height >= 180) {
			footerHeight.value = windowHeight - pageY;
			messageLayout.value.scrollToBottom();
		}
	}
}

const mouseup = (e: any) => {
	moveable.value = false;
}

const developTips = () => {
	uni.showToast({
		icon: 'none',
		title: "开发中，敬请期待"
	});
}

const minimize = () => {
	window.electronAPI.minimize();
}

const close = () => {
	window.electronAPI.close();
}

onLoad(async () => {
	// @ts-ignore

	// let loginCache = await window.electronAPI.getLocalStorage("user-login-cache");
	// coreStore.login(loginCache.userId, loginCache.token, loginCache.timestamp);
	let socketStatus = await window.electronAPI.getSocketStatus();
	if (!socketStatus) {
		// @ts-ignore
		let loginCache = await window.electronAPI.getLocalStorage("user-login-cache");
		coreStore.login(loginCache.userId, loginCache.token, loginCache.timestamp);
	}

	const systemInfo = uni.getSystemInfoSync();
	if (systemInfo.platform == "windows") {
		ifWin.value = true;
	} else {
		ifWin.value = false;
	}
})
</script>

<style lang="scss" scoped>
@font-face {
	font-family: "yeim-ele-icon";
	/* Project id 3933928 */
	src: url('@/static/fonts/iconfont.woff2') format('woff2'),
		url('@/static/fonts/iconfont.woff') format('woff'),
		url('@/static/fonts/iconfont.ttf') format('truetype');
}

.yeim-ele-icon {
	font-family: "yeim-ele-icon" !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.yeim-ele-iconwinfo-icon-zuixiaohua:before {
	content: "\e623";
}

.yeim-ele-iconwinfo-icon-guanbi:before {
	content: "\e625";
}

.yeim-ele-icondianhua1:before {
	content: "\e8ad";
}

.yeim-ele-icondingwei:before {
	content: "\e8ae";
}

.yeim-ele-icongengduo:before {
	content: "\e8af";
}

.yeim-ele-iconshangchuan:before {
	content: "\e8b7";
}

.yeim-ele-iconshequ:before {
	content: "\e8b8";
}

.yeim-ele-icontupian:before {
	content: "\e8ba";
}

.yeim-ele-iconxiangji:before {
	content: "\e8bc";
}

.yeim-ele-iconyuyin:before {
	content: "\e8c0";
}

.yeim-ele-iconzhibo:before {
	content: "\e8c1";
}

.yeim-ele-iconshexiangji:before {
	content: "\e66f";
}

.yeim-ele-icongengduo1:before {
	content: "\ec1c";
}

.yeim-ele-iconpingmugongxiang:before {
	content: "\e746";
}

.yeim-ele-icondianhua:before {
	content: "\e6ad";
}

.yeim-ele-iconbofang:before {
	content: "\e8a3";
}

.yeim-ele-icon:hover {
	color: #0499ff;
}

.ele-container {
	width: 100%;
	height: 100vh;
	background-color: #f3f3f3;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: relative;

	.ele-windows-tools {
		-webkit-app-region: drag;
		width: 100%;
		height: 40px;
		display: flex;
		justify-content: flex-end;

		.ele-action {
			display: flex;
			width: 80px;
			-webkit-app-region: no-drag;

			.ele-action-item {
				width: 40px;
				height: 30px;
				display: flex;
				align-items: center;
				justify-content: center;

				.yeim-ele-icon {
					font-size: 16px;
				}
			}

			.ele-action-item:first-child:hover {
				background-color: #e3e3e3;

				i {
					color: gray !important;
				}
			}

			.ele-action-item:last-child:hover {
				background-color: #ff5656;

				i {
					color: white !important;
				}
			}
		}
	}

	.ele-chat-navbar {
		-webkit-app-region: drag;
		padding-top: 25px;
		padding-bottom: 10px;
		padding-left: 20px;
		padding-right: 20px;
		border-bottom: 1px solid #e9e9e1;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.ele-title {
			font-weight: bold;
		}

		.ele-action {
			-webkit-app-region: no-drag;
			display: flex;
			align-items: center;

			.ele-action-item {
				cursor: pointer;
				margin-left: 25px;

				.yeim-ele-icon {
					font-size: 26px;
				}
			}
		}
	}

	.ele-message-view {
		flex: 1;
		height: 0;

		.ele-message {
			height: 100%;
		}
	}

	.ele-footer-separator {
		border-top: 1px solid #e9e9e1;
		width: 100%;
		height: 3px;
		cursor: ns-resize;
	}

	.ele-footer {
		// border-top: 1px solid #e9e9e1;
		height: 180px;
		display: flex;
		flex-direction: column;

		.ele-footer-toolbar {
			padding: 7px 0;

			.ele-action {
				display: flex;
				align-items: center;

				.ele-action-item {
					margin-left: 20px;

					.yeim-ele-icon {
						font-size: 26px;
					}
				}
			}
		}

		.ele-footer-input {
			width: 100%;
			flex: 1;
			padding-top: 8px;
			padding-left: 21px;

			.ele-textarea {
				width: 100%;
				height: 100%;
			}
		}
	}

	.ele-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		-webkit-app-region: drag;

		image {
			width: 110px;
			height: 110px;
		}
	}
}
</style>
