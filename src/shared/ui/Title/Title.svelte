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

<style>
	.title {
		margin: 0;
		font-weight: 700;
		line-height: 1.2;
	}

	.title-lg {
		font-size: 32px;
	}

	.title-md {
		font-size: 24px;
	}

	.title-s {
		font-size: 18px;
	}
</style>
