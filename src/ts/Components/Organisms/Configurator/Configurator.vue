<script setup lang="ts">
import Section from '../../Organisms/Section/Section.vue';
import ConfiguratorManager from '../../../Classes/ConfiguratorManager.ts';
import { onBeforeUnmount, onMounted, ref, Ref } from 'vue';
import { Color } from 'three';
import { FlameType } from '../../../Enums/FlameType.ts';

// Set variables
const configuratorCanvas: Ref<HTMLCanvasElement | null> = ref(null);

// Life cycles
onMounted(async () => {
	if (!configuratorCanvas.value) {
		return;
	}

	// Init the configurator
	await ConfiguratorManager.instance.init(configuratorCanvas.value);

	// Set flame colors
	ConfiguratorManager.instance.setFlameColor(new Color('purple'), FlameType.OUTSIDE);
	ConfiguratorManager.instance.setFlameColor(new Color('red'), FlameType.INSIDE);
});

onBeforeUnmount(() => {
	// Destroy the configurator
	ConfiguratorManager.instance.destroy();
});
</script>

<template>
	<Section class="configurator" :fluid="true">
		<canvas ref="configuratorCanvas" class="h-full w-full" />
	</Section>
</template>
