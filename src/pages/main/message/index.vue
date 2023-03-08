<template>
	<view class="ele-message">
		<scroll-view id="scrollView" :scroll-y="true" class="ele-message-scroll-view"
			:scroll-with-animation="scrollWithAnimation" :scroll-into-view="scrollIntoView" :scroll-top="scrollTop"
			upper-threshold="0" @scrolltoupper="scrolltoupper">
			<view :id="'message_' + item.messageId" class="ele-message-item"
				:class="item.from == coreStore.userInfo?.userId ? 'ele-right-layout' : 'ele-left-layout'"
				v-for="(item, index) in messageList" :key="index">
				<view class="ele-message-avatar" v-if="item.type != 'group_sys_notice'">
					<image :src="item.fromUserInfo?.avatarUrl"></image>
				</view>
				<view class="ele-message-box" v-if="item.type != 'group_sys_notice'">

					<view class="ele-message-box-text" v-if="item.type == YeIMUniSDKDefines.MESSAGE_TYPE.TEXT">
						<text :selectable="true">{{ (item.body as MessageText).text }}</text>
					</view>

					<view class="ele-message-box-image" v-else-if="item.type == YeIMUniSDKDefines.MESSAGE_TYPE.IMAGE">
						<image :lazy-load="true" @click="previewImage(item)"
							:style="{ width: (item.body as MessageImage).thumbnailWidth + 'px', height: (item.body as MessageImage).thumbnailHeight + 'px' }"
							:src="(item.body as MessageImage).thumbnailUrl" mode="aspectFill"></image>
					</view>

					<view class="ele-message-box-video" v-else-if="item.type == YeIMUniSDKDefines.MESSAGE_TYPE.VIDEO">
						<image class="ele-video-thubmnail" :src="(item.body as MessageVideo).thumbnailUrl"
							mode="aspectFill"></image>
						<view class="ele-video-mask"></view>
						<view class="ele-video-duration">
							00:15
						</view>
						<view class="ele-video-play">
							<i class="yeim-ele-icon yeim-ele-iconbofang"></i>
						</view>
					</view>

					<view class="ele-message-box-audio"
						:class="item.from == coreStore.userInfo?.userId ? 'ele-audio-right-layout' : 'ele-audio-left-layout'"
						v-else-if="item.type == YeIMUniSDKDefines.MESSAGE_TYPE.AUDIO">
						<image src="/static/images/voice_static.png" mode="aspectFill"></image>
						<text>{{ (item.body as MessageAudio).duration }}'</text>
					</view>

				</view>

				<view class="ele-tips-box" v-else>
					<text>{{ (item.body as MessageTips).tips }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
import type { Conversation } from "@/entity/Conversation";
import type { Message } from "@/entity/message/Message";
import type { MessageText } from "@/entity/message/MessageText";
import type { MessageImage } from "@/entity/message/MessageImage";
import type { MessageVideo } from "@/entity/message/MessageVideo";
import type { MessageAudio } from "@/entity/message/MessageAudio";
import type { MessageTips } from "@/entity/message/MessageTips";


//@ts-ignore
import { YeIMUniSDKDefines } from "yeim-uni-sdk";
import {
	ref,
	onMounted,
	nextTick,
	defineExpose
} from "vue";

import {
	useCoreStore
} from '@/stores/useCoreStore'

const coreStore = useCoreStore();

const page = ref(1);

const pageConversation = ref<Conversation>({} as Conversation);

const messageList = ref<Array<Message>>([] as Array<Message>);

const scrollIntoView = ref("");

const scrollTop = ref(0);

const scrollWithAnimation = ref(false);

const getMessageList = () => {
	// @ts-ignore
	uni.$YeIM.getMessageList({
		page: page.value,
		conversationId: coreStore.currentConversaton.conversationId,
		success: (res: any) => {
			if (page.value == 1) {
				messageList.value = res.data as Array<Message>;
				if (res.data.length) {
					nextTick(async () => {
						//滚动方案1
						scrollIntoView.value = "message_" + (messageList.value[messageList.value.length - 1].messageId);
						//滚动方案2
						// let scrollContentHeight = 0;
						// const query = uni.createSelectorQuery().in(this);
						// for (let i = 0; i < messageList.value.length; i++) {
						// 	let messageId = messageList.value[i].messageId;
						// 	let data = await getRect("#message_" + messageId);
						// 	scrollContentHeight = scrollContentHeight + data.height;
						// }
						// scrollTop.value = scrollContentHeight;
					});
				}
			} else {
				if (res.data.length) {
					let lastMessageId: string = messageList.value[0].messageId;
					messageList.value.unshift(...res.data);

					nextTick(async () => {
						////滚动方案1
						scrollIntoView.value = "message_" + lastMessageId;
						//滚动方案2
						// let nowMessageListHeight = 0;
						// const query = uni.createSelectorQuery().in(this);
						// for (let i = 0; i < res.data.length; i++) {
						// 	let messageId = res.data[i].messageId;
						// 	let data = await getRect("#message_" + messageId);
						// 	nowMessageListHeight = nowMessageListHeight + data.height;
						// }
						// scrollTop.value = nowMessageListHeight;
					});
				}
			}
			if (res.data.length) {
				page.value++;
			}
		}
	});
}

const getRect = (selector: string) => {
	return new Promise(resolve => {
		uni.createSelectorQuery().
			in(this)['select'](selector)
			.boundingClientRect(rect => {
				resolve(rect);
			})
			.exec()
	})
}

const previewImage = (item: Message) => {
	let url = (item.body as MessageImage).originalUrl;
	uni.previewImage({
		urls: [url as string],
		longPressActions: {
			itemList: ['发送给朋友', '保存图片', '收藏'],
			success: function (data) {
				console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
			},
			fail: function (err) {
				console.log(err.errMsg);
			}
		}
	});
}

const scrolltoupper = () => {
	getMessageList();
}

const scrollToBottom = () => {
	scrollIntoView.value = "";
	nextTick(() => {
		scrollIntoView.value = "message_" + (messageList.value[messageList.value.length - 1].messageId);
		//scrollTop.value = 9999999 + Math.floor(Math.random() * 9);
	});
}

defineExpose({
	scrollToBottom
})

onMounted(() => {
	uni.$on('onConversationSelected', (conversation: Conversation) => {
		if (pageConversation.value.conversationId != conversation.conversationId) {
			page.value = 1;
			messageList.value = [];
			pageConversation.value = conversation;
			scrollWithAnimation.value = false;
			getMessageList();
		}
	})
	uni.$on('onInsertMessageList', (message: Message) => {
		console.log("onInsertMessageList")
		scrollWithAnimation.value = true;
		messageList.value.push(message);
		nextTick(() => {
			scrollIntoView.value = "message_" + (messageList.value[messageList.value.length - 1].messageId);
			//scrollTop.value = 9999999 + Math.floor(Math.random() * 9);
		});
	})
	//监听新消息接收
	//@ts-ignore
	uni.$YeIM.addEventListener(uni.$YeIMUniSDKDefines.EVENT.MESSAGE_RECEIVED, (message) => {
		console.log("收到新消息:")
		console.log(message)

		scrollWithAnimation.value = true;
		messageList.value.push(message);
		nextTick(() => {
			scrollIntoView.value = "message_" + (messageList.value[messageList.value.length - 1].messageId);
			//scrollTop.value = 9999999 + Math.floor(Math.random() * 9);
		})

		// @ts-ignore 清除指定会话未读数，并给对方发送已读回执
		uni.$YeIM.clearConversationUnread(coreStore.currentConversaton.conversationId);
	});

})
</script>

<style lang="scss" scoped>
@font-face {
	font-family: "yeim-ele-icon";
	/* Project id 3933928 */
	src: url('//at.alicdn.com/t/c/font_3933928_jntoasnasum.woff2?t=1678085417677') format('woff2'),
		url('//at.alicdn.com/t/c/font_3933928_jntoasnasum.woff?t=1678085417677') format('woff'),
		url('//at.alicdn.com/t/c/font_3933928_jntoasnasum.ttf?t=1678085417677') format('truetype');
}

.yeim-ele-icon {
	font-family: "yeim-ele-icon" !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.yeim-ele-iconbofang:before {
	content: "\e8a3";
}


.ele-message {
	height: 100%;


	.ele-message-scroll-view {
		height: 100%;
		// padding-top: 15px; 

		:deep(.uni-scroll-view) {
			overflow-y: overlay !important;
		}

		.ele-message-item {
			background-color: #f3f3f3;
			padding: 0 10px 15px 10px;
			display: flex;
			flex-direction: row;

			.ele-message-avatar {
				padding-left: 10px;
				padding-right: 10px;

				image {
					will-change: transform;
					width: 35px;
					height: 35px;
					border-radius: 17.5px;
				}
			}

			.ele-message-box {
				.ele-message-box-text {
					display: flex;
					align-items: center;
					background-color: #ffffff;
					border-radius: 9px;
					padding: 9px;
					font-size: 15px;
				}

				.ele-message-box-image {
					display: flex;
					align-items: center;

					image {
						border-radius: 5px;
						max-width: 200px;
						max-height: 500px;
					}
				}

				.ele-message-box-video {
					display: flex;
					align-items: center;
					position: relative;

					image {
						border-radius: 5px;
						width: 80px;
						height: 160px;
					}

					.ele-video-mask {
						position: absolute;
						border-radius: 5px;
						width: 100%;
						height: 100%;
						background-color: rgba(0, 0, 0, 0.7);
					}

					.ele-video-duration {
						position: absolute;
						color: white;
						font-size: 12px;
						bottom: 3px;
						right: 5px;
					}

					.ele-video-play {
						position: absolute;
						width: 100%;
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: center;

						.yeim-ele-iconbofang:before {
							color: #ffffff;
							font-size: 32px;
						}
					}
				}

				.ele-message-box-audio {
					display: flex;
					align-items: center;
					justify-content: flex-end;
					background-color: #ffffff;
					border-radius: 9px;
					padding: 9px 12px;
					font-size: 15px;
					width: 100px;

					image {
						width: 20px;
						height: 20px;
						padding: 0 8px;
					}

					text {
						font-size: 16px;
					}
				}

				.ele-audio-left-layout {
					flex-flow: row-reverse;
				}

				.ele-audio-right-layout {
					flex-flow: row-reverse
				}

			}

			.ele-tips-box {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				font-size: 11px;
				color: #797979;
			}

		}

		.ele-message-item:first-child {
			padding: 15px 10px 15px 10px;
		}

		.ele-left-layout {}

		.ele-right-layout {
			flex-flow: row-reverse
		}
	}

	.ele-message-scroll-view:hover ::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.1);
	}

	::-webkit-scrollbar {
		width: 6px;
	}

	::-webkit-scrollbar-track {
		-webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
		box-shadow: inset006pxrgba(0, 0, 0, 0.3);
		border-radius: 10px;
	}

	::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background: rgba(0, 0, 0, 0.1);
		-webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
		box-shadow: inset006pxrgba(0, 0, 0, 0.5);
		background: transparent;
	}

}
</style>
