<template>
	<view class="contaniner">
		<view class="drag-view" />
		<view class="header">
			<image class="logo" :src="logo"></image>
		</view>
		<view class="main-body">
			<view class="input-box" :class="accountInputActive ? 'active' : ''">
				<input class="uni-input" v-model="account" :focus="accountInputFoucs" @focus="onAccountFocus"
					@blur="onAccountBlur" :placeholder="!accountInputFoucs ? '输入聊天账号' : ''" />
				<view class="right-icon" v-if="accountInputActive" @click="clearAccount">
					<uni-icons type="closeempty" size="13" color="#999999"></uni-icons>
				</view>
			</view>
			<view class="input-box" :class="passwordInputActive ? 'active' : ''">

				<input v-if="!showPlainText" class="uni-input" v-model="password" :focus="passwordInputFoucs"
					@focus="onPasswordFocus" @blur="onPasswordBlur" type="password"
					:placeholder="!passwordInputFoucs ? '输入登录密码' : ''" />

				<input v-else class="uni-input" v-model="password" :focus="passwordInputFoucs" @focus="onPasswordFocus"
					@blur="onPasswordBlur" type="text" :placeholder="!passwordInputFoucs ? '输入登录密码' : ''" />

				<view class="left-icon" v-if="passwordInputActive" @click="showPlainText = !showPlainText">
					<uni-icons :type="showPlainText ? 'eye-slash' : 'eye'" size="13" color="#999999"></uni-icons>
				</view>
				<view class="right-icon" v-if="passwordInputActive" @click="clearPassword">
					<uni-icons type="closeempty" size="13" color="#999999"></uni-icons>
				</view>
			</view>
			<view class="agreement-row">
				<checkbox-group @change="checkChanged">
					<label class="uni-list-cell">
						<view>
							<checkbox :class="checked ? 'checked' : ''" :checked="checked" />
						</view>
						<view class="describe">已阅读并同意
							<text>软件隐私政策</text>
							和
							<text>聊天服务协议</text>
						</view>
					</label>
				</checkbox-group>
			</view>
			<view class="submit-row">
				<button class="submit-button" :class="(account && password) ? 'active' : ''" :loading="logging"
					type="primary" @click="(account && password) ? login() : ''">登录
				</button>
			</view>
		</view>

		<view class="footer">
			<text class="text">扫码登录</text>
			<text class="separator">|</text>
			<text class="text">注册账号</text>
		</view>
	</view>
</template>

<script setup lang="ts">
import {
	ref
} from "vue";
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import { YeIMUniSDK } from 'yeim-uni-sdk';
// @ts-ignore
import md5 from 'js-md5';

const logo = ref("./static/images/logo.png");
const accountInputActive = ref(false);
const passwordInputActive = ref(false);
const accountInputFoucs = ref(false);
const passwordInputFoucs = ref(false);
const showPlainText = ref(false);
const account = ref("user2");
const password = ref("123456");
const checked = ref(true);
const logging = ref(false);


//方法 

const onAccountFocus = () => {
	accountInputActive.value = true;
	accountInputFoucs.value = true;
}

const onAccountBlur = () => {
	if (!account.value) {
		accountInputActive.value = false;
	}
	accountInputFoucs.value = false;
}

const onPasswordFocus = () => {
	passwordInputActive.value = true;
	passwordInputFoucs.value = true;
}

const onPasswordBlur = () => {
	if (!password.value) {
		passwordInputActive.value = false;
	}
	passwordInputFoucs.value = false;
}

const clearAccount = () => {
	account.value = "";
	accountInputFoucs.value = true;
}

const clearPassword = () => {
	password.value = "";
	passwordInputFoucs.value = true;
}

const checkChanged = (e: any) => {
	if (e.detail.value.length == 0) {
		checked.value = false;
	} else {
		checked.value = true;
	}
}

const login = () => {
	logging.value = true;
	//模拟计算sign，换取登陆Token，此处应在自己系统的服务端进行。
	let timestamp = (new Date()).getTime() + 86400 * 1000; //1天后过期
	let sign = md5(account.value + timestamp + "50abd47112ebe8c5a73f4694c96a49ce");

	uni.request({
		// @ts-ignore
		url: YeIMUniSDK.getInstance().defaults.baseURL + "/user/token/get",
		method: 'POST',
		data: {
			userId: account.value,
			timestamp: timestamp,
			sign: sign
		},
		success: (res: any) => {
			let response = res.data;
			if (response.code == 500) {
				uni.showToast({
					icon: 'none',
					title: response.message
				})
			} else {
				//换取token成功，跳转到主界面
				//@ts-ignore
				window.electronAPI.openMain({
					userId: account.value,
					token: response.data.token,
					timestamp: timestamp
				});
			}
			console.log(res.data);
		},
		fail: (err: any) => {
			uni.showToast({
				icon: 'none',
				title: err
			})
		},
		complete: () => {
			logging.value = false;
		}
	});
}
</script>

<style lang="scss" scoped>
page {
	background: url('@/static/images/login_bg.png') no-repeat;
	background-size: cover;
	background-attachment: fixed;
}

.contaniner {
	display: flex;
	flex-direction: column;
	align-items: center;

	.drag-view {
		height: 65px;
		width: 100%;
		-webkit-app-region: drag
	}

	.header {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		.logo {
			width: 80px;
			height: 80px;
			border-radius: 40px;
			margin-bottom: 10px;
		}
	}

	.main-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;

		.input-box {
			width: 80%;
			background-color: rgba(255, 255, 255, 0.6);
			margin-top: 12px;
			font-weight: bold;
			display: flex;
			justify-content: center;
			padding: 11px 0;
			border-radius: 5px;

			.left-icon {
				cursor: pointer;
				position: absolute;
				left: 15%;
			}

			.right-icon {
				cursor: pointer;
				position: absolute;
				right: 15%;
			}

			.uni-input {
				width: 60%;
			}

			:deep(.input-placeholder) {
				text-align: center;
				font-size: 15px;
				font-weight: normal;
			}

			:deep(.uni-input-input) {
				text-align: center;
				font-size: 20px;
				font-weight: 500;
			}
		}

		.active {
			background-color: white;
		}

		.agreement-row {
			margin-top: 15px;

			.uni-list-cell {
				display: flex;
				align-items: center;

				uni-checkbox {
					display: flex;
				}

				:deep(.uni-checkbox-input) {
					width: 14px;
					height: 14px;
					border-radius: 14px;
					border-color: transparent;
				}

				.checked {
					:deep(.uni-checkbox-input) {
						width: 14px;
						height: 14px;
						border-radius: 14px;
						background-color: #0499ff;
						border-color: transparent;

						svg {
							width: 14px;
							height: 14px;

							path {
								fill: white;
							}
						}
					}
				}

				:deep(.uni-checkbox-input-checked::before) {
					font-size: 15px;
					color: white;
				}

				.describe {
					font-size: 12px;
					color: #999999;

					text {
						color: #2e77e5;
					}
				}
			}
		}

		.submit-row {
			margin-top: 22px;
			width: 100%;

			.submit-button {
				width: 80%;
				background-color: rgba(43, 161, 255, 0.3);
				font-size: 15px;
			}

			.active {
				background-color: rgb(43, 161, 255);
			}

			.submit-button::after {
				border: unset;
			}
		}
	}

	.footer {
		margin-top: 35px;
		display: flex;
		align-items: center;
		font-size: 12px;

		.text {
			cursor: pointer;
			color: #2e77e5;
		}

		.separator {
			color: #dddddd;
			width: 23px;
			font-size: 12px;
			text-align: center;
		}
	}
}
</style>
