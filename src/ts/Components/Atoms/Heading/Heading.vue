<script setup lang="ts">
import IHeadingTag from '../../../Interfaces/IHeadingTag.ts';

// Define props
const props = withDefaults(defineProps<IHeadingTag>(), {
	tag: 'h1'
});
</script>

<template>
	<component :is="props.tag" class="heading">
		<slot />
	</component>
</template>
