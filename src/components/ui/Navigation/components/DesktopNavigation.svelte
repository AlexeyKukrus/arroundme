<script lang="ts">
	// DesktopNavigation
	import { page } from '$app/stores';
	import { navigationTabsList } from '../helpers/helper-options';
</script>

<nav class="nav">
	{#each navigationTabsList as { href, icon, label }}
		{#if href}
			<a {href} class="nav-item" aria-label={label}>
				<img
					src={icon}
					alt={label}
					class="icon {$page.url.pathname.startsWith(href) ? 'active-icon' : ''}"
				/>
			</a>
		{:else}
			<button class="nav-item" type="button" aria-label={label}>
				<img src={icon} alt={label} class="icon" />
			</button>
		{/if}
	{/each}
</nav>
