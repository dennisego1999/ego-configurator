<script setup lang="ts">
import ISectionTag from '../../../Interfaces/ISectionTag.ts';

// Define props
withDefaults(defineProps<ISectionTag>(), {
	tag: 'section'
});
</script>

<template>
	<component :is="tag" class="section">
		<div class="section__inner">
			<slot />
		</div>
	</component>
</template>
