<template>
	<view class="ele-sidebar"
		:style="'height: calc(100vh - ' + (headerPaddingTop + 35) + 'px); padding:' + headerPaddingTop + 'px 0 35px 0;'">
		<view class="ele-header">
			<image class="ele-logo" src="/static/images/logo_black_icon.png" mode="aspectFill"></image>
			<text>YE</text>
		</view>

		<view class="ele-userinfo">
			<view class="ele-relative">
				<image class="ele-avatar" :src="coreStore.userInfo?.avatarUrl" mode="aspectFill">
				</image>
				<view class="ele-online-status" />
			</view>
		</view>

		<view class="ele-tabbar">
			<view class="ele-tabbar-item" :class="index == tabbarSelectedIndex ? 'ele-active' : ''"
				v-for="(item, index) in tabbarList" :key="index" @click="tabbarClick(index)">
				<image class="ele-item-image" :src="index == tabbarSelectedIndex ? item.selectedIcon : item.icon"
					mode="aspectFill"></image>
			</view>
		</view>

		<view class="ele-footer-action">
			<view class="ele-footer-action-item" @click="developTips">
				<image class="ele-action-item-image" src="/static/images/tabbar/computer.png" mode="aspectFill"></image>
			</view>
			<view class="ele-footer-action-item" @click="developTips">
				<image class="ele-action-item-image" src="/static/images/tabbar/settings.png" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import {
	ref,
	onMounted
} from "vue";
import {
	useCoreStore
} from '@/stores/useCoreStore'

const headerPaddingTop = ref(35);

const coreStore = useCoreStore()

const tabbarSelectedIndex = ref(0);
const tabbarList = ref([{
	icon: "/static/images/tabbar/msg.png",
	selectedIcon: "/static/images/tabbar/msg_on.png",
},
{
	icon: "/static/images/tabbar/contact.png",
	selectedIcon: "/static/images/tabbar/contact_on.png",
},
{
	icon: "/static/images/tabbar/game.png",
	selectedIcon: "/static/images/tabbar/game_on.png",
}
])



const tabbarClick = (index: number) => {
	tabbarSelectedIndex.value = index;
	uni.showToast({
		icon: 'none',
		title: "开发中，敬请期待"
	});
}

const developTips = () => {
	uni.showToast({
		icon: 'none',
		title: "开发中，敬请期待"
	});
}

onMounted(() => {
	const systemInfo = uni.getSystemInfoSync();
	if (systemInfo.platform == "windows") {
		headerPaddingTop.value = 10;
	} else {
		headerPaddingTop.value = 35;
	}
})

</script>

<style lang="scss" scoped>
@font-face {
	font-family: "阿里妈妈东方大楷 Regular";
	font-weight: 400;
	src: url("@/static/fonts/dN5LuXJrswykk4LiP7kCT.woff2") format("woff2"),
		url("@/static/fonts/dN5LuXJrswykk4LiP7kCT.woff") format("woff");
	font-display: swap;
}

.ele-sidebar {
	background-color: rgba(228, 228, 228, 0.98);
	width: 65px;
	// height: calc(100vh - 70px);
	// padding: 35px 0 35px 0;
	position: relative;

	.ele-header {
		display: flex;
		align-items: center;
		justify-content: center;

		.ele-logo {
			width: 16px;
			height: 16px;
		}

		text {
			font-size: 15px;
			font-family: "阿里妈妈东方大楷 Regular";
			font-weight: 400;
			padding-left: 3px;
		}

	}

	.ele-userinfo {
		display: flex;
		justify-content: center;
		margin-top: 20px;

		.ele-relative {
			position: relative;
			width: 40px;
			height: 40px;

			.ele-avatar {
				width: 40px;
				height: 40px;
				border-radius: 20px;
			}

			.ele-online-status {
				position: absolute;
				bottom: 0;
				right: 0;
				width: 11px;
				height: 11px;
				border-radius: 11px;
				background-color: #2ee68a;
				border: 2px solid #d5d6d7;
			}
		}
	}

	.ele-tabbar {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 20px;

		.ele-tabbar-item {
			margin-bottom: 10px;
			width: 42px;
			height: 42px;
			border-radius: 9px;
			display: flex;
			align-items: center;
			justify-content: center;

			.ele-item-image {
				width: 25px;
				height: 25px;
			}
		}

		.ele-tabbar-item:hover {
			background-color: #d7d7d7;
		}

		.ele-active {
			background-color: #d7d7d7;
		}
	}

	.ele-footer-action {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: absolute;
		bottom: 10px;
		margin-top: 20px;
		width: 100%;

		.ele-footer-action-item {
			margin-bottom: 10px;
			width: 32px;
			height: 32px;
			border-radius: 9px;
			display: flex;
			align-items: center;
			justify-content: center;

			.ele-action-item-image {
				width: 25px;
				height: 25px;
			}
		}
	}
}
</style>
