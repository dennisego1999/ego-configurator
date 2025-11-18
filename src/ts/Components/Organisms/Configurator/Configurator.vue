<script setup lang="ts">
import Section from '../../Organisms/Section/Section.vue';
import ConfiguratorManager from '../../../Classes/ConfiguratorManager.ts';
import { onBeforeUnmount, onMounted, ref, watch, Ref } from 'vue';
import { Color } from 'three';
import { FlameType } from '../../../Enums/FlameType.ts';
import ColorPicker from '../../Molecules/ColorPicker/ColorPicker.vue';

// Set variables
const configuratorCanvas: Ref<HTMLCanvasElement | null> = ref(null);
const outerFlameColor = ref('#ff0000');
const innerFlameColor = ref('#00aaff');

// Define method
function applyFlameColor(type: FlameType, hex: string) {
	ConfiguratorManager.instance.setFlameColor(new Color(hex), type);
}

// Set watchers
watch(outerFlameColor, (newColor) => {
	applyFlameColor(FlameType.OUTER, newColor);
});

watch(innerFlameColor, (newColor) => {
	applyFlameColor(FlameType.INNER, newColor);
});

// Lifecycles
onMounted(async () => {
	if (!configuratorCanvas.value) return;

	// Init configurator
	await ConfiguratorManager.instance.init(configuratorCanvas.value);

	// Set initial colors
	applyFlameColor(FlameType.OUTER, outerFlameColor.value);
	applyFlameColor(FlameType.INNER, innerFlameColor.value);
});

onBeforeUnmount(() => {
	// Destroy the configurator
	ConfiguratorManager.instance.destroy();
});
</script>

<template>
	<Section class="configurator" :fluid="true">
		<canvas ref="configuratorCanvas" class="h-full w-full" />

		<ColorPicker v-model:color="outerFlameColor" :data-flame-type="FlameType.OUTER">
			<template #title> Outer flames 🔥</template>
		</ColorPicker>

		<ColorPicker v-model:color="innerFlameColor" :data-flame-type="FlameType.INNER">
			<template #title> Inner flames 🔥</template>
		</ColorPicker>
	</Section>
</template>
