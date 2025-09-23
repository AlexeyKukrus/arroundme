<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	import { isAuthenticated, showAuthModal } from '@app/models/auth/store';
	import { user } from '@app/models/users/store';

	import { Notifications, Header } from '@shared/ui';
	import { AuthFormModal } from '@shared/modals';
	
	import '../main.css';

	let isMobile = false;

	onMount(() => {
		const token = localStorage.getItem('auth-token');
		if (!token) {
			showAuthModal.set(true);
		} else {
			isAuthenticated.set(true);
		}

		user.initIfEmpty();

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
	<Header />
	<main class:mobile={isMobile} class:desktop={!isMobile}>
		<slot />
	</main>
</div>

{#if $showAuthModal}
	<AuthFormModal />
{/if}

<Notifications />
