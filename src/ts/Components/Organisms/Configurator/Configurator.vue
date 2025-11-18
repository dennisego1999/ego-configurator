<script setup lang="ts">
import Section from '../../Organisms/Section/Section.vue';
import ConfiguratorManager from '../../../Classes/ConfiguratorManager.ts';
import { onBeforeUnmount, onMounted, ref, watch, Ref } from 'vue';
import { Color } from 'three';
import { FlameType } from '../../../Enums/FlameType.ts';
import ColorPicker from '../../Molecules/ColorPicker/ColorPicker.vue';
import AudioIcon from '../../Atoms/AudioIcon/AudioIcon.vue';
import IAudioItem from '../../../Interfaces/IAudioItem.ts';

// Set variables
const configuratorCanvas: Ref<HTMLCanvasElement | null> = ref(null);
const outerFlameColor: Ref<string> = ref('#ff0000');
const innerFlameColor: Ref<string> = ref('#ffffff');
const backgroundAudio: Ref<HTMLAudioElement | null> = ref(null);
const spaceshipAudio: Ref<HTMLAudioElement | null> = ref(null);
const audioFiles: IAudioItem[] = [
	{ el: backgroundAudio, volume: 1 },
	{ el: spaceshipAudio, volume: 0.03 }
];
const isPlaying = ref(false);

// Define methods
function applyFlameColor(type: FlameType, hex: string) {
	ConfiguratorManager.instance.setFlameColor(new Color(hex), type);
}

function toggleAudio() {
	audioFiles.forEach((audio) => {
		if (!audio.el.value) {
			return;
		}

		if (audio.el.value.paused) {
			audio.el.value.play().catch((err) => {
				console.warn('Audio play failed:', err);
			});

			audio.el.value.muted = false;
			audio.el.value.volume = audio.volume;
			isPlaying.value = true;

			return;
		}

		audio.el.value.pause();
		isPlaying.value = false;
	});
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
	ConfiguratorManager.instance.destroy();
});
</script>

<template>
	<Section class="configurator" :fluid="true">
		<AudioIcon
			class="absolute top-2 right-2 z-10 h-8 w-8 cursor-pointer text-white"
			:enabled="isPlaying"
			@click="toggleAudio"
		/>

		<canvas ref="configuratorCanvas" class="h-full w-full" />

		<ColorPicker v-model:color="outerFlameColor" :data-flame-type="FlameType.OUTER">
			<template #title> Outer flames 🔥</template>
		</ColorPicker>

		<ColorPicker v-model:color="innerFlameColor" :data-flame-type="FlameType.INNER">
			<template #title> Inner flames 🔥</template>
		</ColorPicker>

		<audio ref="backgroundAudio" src="/assets/audio/interstellar.mp3" muted loop preload="auto" />
		<audio ref="spaceshipAudio" src="/assets/audio/spaceship.mp3" muted loop preload="auto" />
	</Section>
</template>
