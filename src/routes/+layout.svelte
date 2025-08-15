<script lang="ts">
	import { browser } from '$app/environment';
	import { isAuthenticated, showAuthModal } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import MobileNavigation from '../components/ui/Navigation/components/MobileNavigation.svelte';
	import DesktopNavigation from '../components/ui/Navigation/components/DesktopNavigation.svelte';
	import AuthFormModal from '../components/ui/AuthFormModal/AuthFormModal.svelte';
	import '../main.css';

	export const prerender = true

	let isMobile = false;

	onMount(() => {
		const token = localStorage.getItem('auth-token');
		if (!token) {
			showAuthModal.set(true);
		} else {
			isAuthenticated.set(true);
		}

		if (browser) {
			const checkMobile = () => {
				isMobile = window.matchMedia('(max-width: 1024px)').matches;
			};

			checkMobile();
			window.addEventListener('resize', checkMobile);

			return () => window.removeEventListener('resize', checkMobile);
		}
	});
</script>

<div class="app-container">
	{#if isMobile}
		<MobileNavigation />
	{:else}
		<DesktopNavigation />
	{/if}

	<main class:mobile={isMobile} class:desktop={!isMobile}>
		<slot />
	</main>
</div>

{#if $showAuthModal}
	<AuthFormModal />
{/if}
