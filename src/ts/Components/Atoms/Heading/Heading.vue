<script setup lang="ts">
import { Alignment } from '../../../Enums/Alignment.ts';
import IHeading from '../../../Interfaces/IHeading.ts';

const { size = 1, align = Alignment.LEFT, tag = 'div' } = defineProps<IHeading>();
</script>

<template>
	<component :is="tag" class="heading" :data-size="size" :data-align="align">
		<slot />
	</component>
</template>
