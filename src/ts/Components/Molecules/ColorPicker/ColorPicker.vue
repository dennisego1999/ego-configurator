<script setup lang="ts">
import { ref, onMounted, onUnmounted, Ref } from 'vue';
import Heading from '../../Atoms/Heading/Heading.vue';

// Define model
const color = defineModel<string>('color', { default: '#ff0000' });

// Set variables
let drag: 'sat' | 'hue' | null = null;
const h: Ref<number> = ref(0);
const s: Ref<number> = ref(100);
const l: Ref<number> = ref(50);
const satRef: Ref<HTMLElement | null> = ref(null);
const hueRef: Ref<HTMLElement | null> = ref(null);

// Define methods
function hslToHex(h: number, s: number, l: number): string {
	l /= 100;
	const a = (s * Math.min(l, 1 - l)) / 100;
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const col = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * col)
			.toString(16)
			.padStart(2, '0');
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHSL(hex: string) {
	const r = parseInt(hex.slice(1, 3), 16) / 255;
	const g = parseInt(hex.slice(3, 5), 16) / 255;
	const b = parseInt(hex.slice(5, 7), 16) / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h_ = 0;
	let s_ = 0;
	const l_ = (max + min) / 2;

	if (max === min) {
		h_ = s_ = 0;
	} else {
		const d = max - min;
		s_ = l_ > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h_ = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h_ = (b - r) / d + 2;
				break;
			case b:
				h_ = (r - g) / d + 4;
				break;
		}
		h_ /= 6;
	}
	return {
		h: Math.round(h_ * 360),
		s: Math.round(s_ * 100),
		l: Math.round(l_ * 100)
	};
}

function updateHex() {
	color.value = hslToHex(h.value, s.value, l.value);
}

function handleSatMove(e: MouseEvent) {
	if (!satRef.value) return;
	const r = satRef.value.getBoundingClientRect();
	const x = Math.max(0, Math.min(e.clientX - r.left, r.width));
	const y = Math.max(0, Math.min(e.clientY - r.top, r.height));

	s.value = Math.round((x / r.width) * 100);
	l.value = Math.round(100 - (y / r.height) * 100);
	updateHex();
}

function handleHueMove(e: MouseEvent) {
	if (!hueRef.value) return;
	const r = hueRef.value.getBoundingClientRect();
	const x = Math.max(0, Math.min(e.clientX - r.left, r.width));

	h.value = Math.round((x / r.width) * 360);
	updateHex();
}

function onMove(e: MouseEvent) {
	if (drag === 'sat') handleSatMove(e);
	if (drag === 'hue') handleHueMove(e);
}

function onUp() {
	drag = null;
}

// Life cycles
onMounted(() => {
	const hsl = hexToHSL(color.value);
	h.value = hsl.h;
	s.value = hsl.s;
	l.value = hsl.l;

	window.addEventListener('mousemove', onMove);
	window.addEventListener('mouseup', onUp);
});

onUnmounted(() => {
	window.removeEventListener('mousemove', onMove);
	window.removeEventListener('mouseup', onUp);
});
</script>

<template>
	<div class="color-picker">
		<Heading class="color-picker__title">
			<slot name="title" />
		</Heading>

		<div class="color-picker__preview" :style="{ backgroundColor: color }" />

		<div
			ref="satRef"
			class="color-picker__sat-light"
			:style="{ background: `hsl(${h}, 100%, 50%)` }"
			@mousedown="
				(e) => {
					drag = 'sat';
					handleSatMove(e);
				}
			"
		>
			<div class="color-picker__sat-white"></div>
			<div class="color-picker__sat-black"></div>

			<div
				class="color-picker__cursor"
				:style="{
					left: s + '%',
					top: 100 - l + '%'
				}"
			/>
		</div>

		<div
			ref="hueRef"
			class="color-picker__hue"
			@mousedown="
				(e) => {
					drag = 'hue';
					handleHueMove(e);
				}
			"
		>
			<div class="color-picker__hue-cursor" :style="{ left: (h / 360) * 100 + '%' }" />
		</div>
	</div>
</template>
