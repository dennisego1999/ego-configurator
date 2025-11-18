<script setup lang="ts">
import { Alignment } from '../../../Enums/Alignment.ts';
import IText from '../../../Interfaces/IText.ts';

const { align = Alignment.LEFT, size = 2, tag = 'span' } = defineProps<IText>();
</script>

<template>
	<component :is="tag" class="text" :data-size="size" :data-align="align">
		<slot />
	</component>
</template>
