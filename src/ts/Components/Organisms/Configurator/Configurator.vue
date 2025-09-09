<script setup lang="ts">
import ConfiguratorManager from '../../../Classes/ConfiguratorManager.ts';
import { onBeforeUnmount, onMounted, ref, Ref } from 'vue';

// Set variables
const configuratorCanvas: Ref<HTMLCanvasElement | null> = ref(null);

// Life cycles
onMounted(() => {
	if (!configuratorCanvas.value) {
		return;
	}

	// Init the configurator
	ConfiguratorManager.instance.init(configuratorCanvas.value);
});

onBeforeUnmount(() => {
	// Destroy the configurator
	ConfiguratorManager.instance.destroy();
});
</script>

<template>
	<div class="configurator">
		<canvas ref="configuratorCanvas" />
	</div>
</template>
