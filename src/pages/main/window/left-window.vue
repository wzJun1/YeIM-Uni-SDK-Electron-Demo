<template>
	<view class="ele-left-container">
		<sidebar></sidebar>
		<list></list>
	</view>
</template>

<script setup lang="ts">
import sidebar from './left/sidebar.vue'
import list from './left/list.vue'
</script>

<style lang="scss" scoped>
.ele-left-container {
	width: calc(65px + 260px);
	height: 100vh;
	overflow: hidden;
	display: flex;
}
</style>
