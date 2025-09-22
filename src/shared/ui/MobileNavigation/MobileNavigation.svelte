<script lang="ts">
	// MobileNavigation
	import MobileDrawerModal from '@shared/modals/MobileDrawerModal/MobileDrawerModal.svelte';
	import { AvatarMenu } from '@shared/ui';

	let isMenuOpen = false;

	const toggleMenu = () => (isMenuOpen = !isMenuOpen);
	const closeMenu = () => (isMenuOpen = false);
</script>

<header class="header">
	<button class="burger {isMenuOpen ? 'active' : ''}" on:click={toggleMenu} aria-label="Меню">
		<span class="line"></span>
		<span class="line"></span>
		<span class="line"></span>
	</button>

	<div class="spacer"></div>

	<AvatarMenu />
</header>

<MobileDrawerModal bind:isOpen={isMenuOpen} onClose={closeMenu} />

