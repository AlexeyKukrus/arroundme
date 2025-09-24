<script lang="ts">
	export let size: 'lg' | 'md' | 's' = 'md';
	export let text: string = '';

	const tagBySize: Record<'lg' | 'md' | 's', 'h1' | 'h2' | 'h3'> = {
		lg: 'h1',
		md: 'h2',
		s: 'h3'
	};

	$: Tag = tagBySize[size] || 'h2';
</script>

<svelte:element this={Tag} class={`title title-${size}`}>
	<slot>{text}</slot>
</svelte:element>
