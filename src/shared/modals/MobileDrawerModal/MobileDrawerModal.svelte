<script lang="ts">
	// MobileDrawerModal
	import { page } from '$app/stores';
	import { navigationTabsList } from '@shared/helpers/helper-options';

	export let isOpen: boolean = false;
	export let onClose: () => void;
</script>

<div class="overlay" class:visible={isOpen} on:click={onClose} tabindex="0" aria-hidden={!isOpen}></div>

<aside class="drawer" class:open={isOpen} role="dialog" aria-modal="true" aria-label="Навигация">
    <nav class="mobile-nav" role="menu">
		{#each navigationTabsList as { href, mobileIcon, label }}
			{#if href}
                <a {href} class="mobile-nav-item" on:click={onClose} role="menuitem" tabindex="0">
					<img
						src={mobileIcon}
						alt={label}
						class="icon {$page.url.pathname.startsWith(href) ? 'mobile-active-icon' : ''}"
					/>
					<span class="label">{label}</span>
				</a>
			{:else}
                <button class="mobile-nav-item" on:click={onClose} role="menuitem">
					<img src={mobileIcon} alt={label} class="icon" />
					<span class="label">{label}</span>
				</button>
			{/if}
		{/each}
	</nav>
</aside>

