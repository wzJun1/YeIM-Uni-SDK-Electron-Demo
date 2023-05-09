<template>
	<view class="ele-list-container">
		<view class="ele-list-header">
			<view class="ele-search-bar">
				<ele-gray-input prefixIcon="search" :inputBorder="false" placeholder="搜索"></ele-gray-input>
			</view>
			<view class="ele-menu-box">
				<uni-icons type="plusempty" size="13" color="#7f7f7f"></uni-icons>
			</view>
		</view>

		<scroll-view :scroll-y="true" class="ele-conversation-list" scroll-with-animation="true">
			<uni-list :border="false">
				<uni-list-chat v-for="(item, index) in coreStore.conversationList" :key="index"
					:title="item.type == 'private' ? item.userInfo?.nickname : item.groupInfo?.name"
					:avatar="item.type == 'private' ? item.userInfo?.avatarUrl : item.groupInfo?.avatarUrl"
					:note="item.lastMessage.body.text ? item.lastMessage.body.text : '[其他类型消息]'"
					:time="dateTimeFormat(item.createdAt)" :badge-text="item.unread" class="ele-conversation-item"
					:class="selectedConversationId == item.conversationId ? 'active' : ''" clickable
					@click="conversationClick(item)">
				</uni-list-chat>
			</uni-list>
		</scroll-view>

	</view>
</template>

<script setup lang="ts">
import eleGrayInput from "@/components/ele-gray-input/ele-gray-input.vue"
import uniList from "@/components/uni-list/uni-list.vue"
import uniListChat from "@/components/uni-list-chat/uni-list-chat.vue"
import type { Conversation } from "@/entity/Conversation";
import {
	ref
} from "vue";

import {
	useCoreStore
} from '@/stores/useCoreStore'
import { YeIMUniSDK } from "yeim-uni-sdk";
const coreStore = useCoreStore()

const selectedConversationId = ref("");

const conversationClick = (item: Conversation) => {
	selectedConversationId.value = item.conversationId;
	coreStore.currentConversaton = item;
	console.log(item);
	// 清除指定会话未读数，并给对方发送已读回执
	YeIMUniSDK.getInstance()?.clearConversationUnread(item.conversationId);
	uni.$emit('onConversationSelected', item);
}



const dateTimeFormat = (date: number) => {
	//date = date +
	//  auto 0
	const autoZero = (n: number) => (String(n).length === 1 ? '0' : '') + n
	// string to timestamp
	const strToTimestamp = (str: string) => Date.parse(str.replace(/-/gi, '/'))
	let oriSecond = date
	let curSecond = new Date().getTime()
	let diffSecond = curSecond - oriSecond
	let curDate = new Date(curSecond)
	let oriDate = new Date(oriSecond)

	let Y = oriDate.getFullYear()
	let m = oriDate.getMonth() + 1
	let d = oriDate.getDate()
	let H = oriDate.getHours()
	let i = oriDate.getMinutes()

	// just
	if (diffSecond < 60) {
		// within a minute
		return '刚刚'
	} else if (diffSecond < 3600) {
		// within an hour
		return `${Math.floor(diffSecond / 60)}分钟前`
	} else if (
		curDate.getFullYear() === Y &&
		curDate.getMonth() + 1 === m &&
		curDate.getDate() === d
	) {
		return `今天${autoZero(H)}:${autoZero(i)}`
	}
	// yesterday
	let mewDate = new Date((curSecond - 86400))
	if (mewDate.getFullYear() === Y && mewDate.getMonth() + 1 === m && mewDate.getDate() === d) {
		return `昨天${autoZero(H)}:${autoZero(i)}`
	} else if (curDate.getFullYear() === Y) {
		return `${autoZero(m)}月${autoZero(d)}日`
	}
	return `${Y}年${autoZero(m)}月${autoZero(d)}日`
}
</script>

<style lang="scss" scoped>
.ele-list-container {
	width: 250px;
	height: calc(100vh);
	background-color: white;
	overflow-y: overlay;


	.ele-list-header {
		display: flex;
		align-items: center;
		padding-top: 25px;
		-webkit-app-region: drag;

		.ele-search-bar {
			width: 100%;
			margin: 10px 0 10px 15px;
			-webkit-app-region: no-drag
		}

		.ele-menu-box {
			background-color: #ededed;
			min-width: 28px;
			height: 28px;
			margin-right: 15px;
			margin-left: 8px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 4px;
			-webkit-app-region: no-drag
		}

		.ele-menu-box:hover {
			background-color: #d7d7d7;
		}
	}

	.ele-conversation-list {
		height: calc(100vh - 10px - 10px - 28px - 25px);
		overflow-y: overlay;

		.ele-conversation-item:hover {
			background-color: #f7f7f7;
		}

		.active {
			background-color: #0499ff;

			:deep(text) {
				color: white;
			}

			&:hover {
				background-color: #0499ff;
			}
		}


	}

	.ele-conversation-list:hover ::-webkit-scrollbar-thumb {
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
