<script lang="ts">
	import { isAuthenticated, showAuthModal } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import AuthFormModal from '../components/ui/AuthFormModal/AuthFormModal.svelte';
	import '../main.css';

	onMount(() => {
		const token = localStorage.getItem('auth-token');
		if (!token) {
			showAuthModal.set(true);
		} else {
			isAuthenticated.set(true);
		}
	});
</script>

<slot />
{#if $showAuthModal}
	<AuthFormModal />
{/if}
