<script lang="ts">
	// MobileDrawerModal
	import { page } from '$app/stores';
	import { navigationTabsList } from '../helpers/helper-options';

	export let isOpen = false;
	export let onClose: () => void;
</script>

<div class="overlay" class:visible={isOpen} on:click={onClose}></div>

<aside class="drawer" class:open={isOpen}>
	<nav class="mobile-nav">
		{#each navigationTabsList as { href, mobileIcon, label }}
			{#if href}
				<a {href} class="mobile-nav-item" on:click={onClose}>
					<img
						src={mobileIcon}
						alt={label}
						class="icon {$page.url.pathname.startsWith(href) ? 'mobile-active-icon' : ''}"
					/>
					<span class="label">{label}</span>
				</a>
			{:else}
				<button class="mobile-nav-item" on:click={onClose}>
					<img src={mobileIcon} alt={label} class="icon" />
					<span class="label">{label}</span>
				</button>
			{/if}
		{/each}
	</nav>
</aside>
