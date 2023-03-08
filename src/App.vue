<script setup lang="ts">
import {
	onLaunch,
	onShow,
	onHide
} from "@dcloudio/uni-app";

onLaunch(() => {
	console.log("App Launch");
});
onShow(() => {
	console.log("App Show");
});
onHide(() => {
	console.log("App Hide");
});
</script>
<style lang="scss">
* {
	font-family: sans-serif;
}

image {
	will-change: transform
}

@for $i from 1 through 30 {
	.margin-left-#{$i} {
		margin-left: #{$i}px !important;
	}
}

@for $i from 1 through 30 {
	.font-size-#{$i} {
		font-size: #{$i}px !important;
	}
}
</style>
