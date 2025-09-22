<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import MobileNavigation from '@shared/ui/MobileNavigation/MobileNavigation.svelte';
	import DesktopNavigation from '@shared/ui/DesktopNavigation/DesktopNavigation.svelte';

	let isMobile = false;

	onMount(() => {
		if (!browser) return;
		const check = () => {
			isMobile = window.matchMedia('(max-width: 1024px)').matches;
		};
		check();
		window.addEventListener('resize', check);
		return () => window.removeEventListener('resize', check);
	});
</script>

{#if isMobile}
	<MobileNavigation />
{:else}
	<DesktopNavigation />
{/if}


