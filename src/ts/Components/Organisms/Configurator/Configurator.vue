<script setup lang="ts">
import Section from '../../Organisms/Section/Section.vue';
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
	<Section class="configurator">
		<canvas ref="configuratorCanvas" class="h-full w-full" />
	</Section>
</template>
