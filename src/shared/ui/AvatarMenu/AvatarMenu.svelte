<script lang="ts">
	import { goto } from '$app/navigation';
	import { isAuthenticated, showAuthModal } from '@app/models/auth/store';
	import { user } from '@app/models/users/store';

	export let imageSrc: string = '/event.jpg';
	export let imageAlt: string = 'User avatar';

	let isOpen = false;

	const toggleOpen = () => (isOpen = !isOpen);
	const close = () => (isOpen = false);

	const onViewProfile = () => {
		close();
		goto('/profile');
	};

	const onEditUser = () => {
		close();
		goto('/profile/edit');
	};

	const onDeleteUser = () => {
		close();
		user.deleteUser();
	};

	const onLogout = () => {
		close();
		localStorage.removeItem('auth-token');
		isAuthenticated.set(false);
		showAuthModal.set(true);
	};
</script>

<svelte:window
	on:keydown={(e) => {
		if (isOpen && e.key === 'Escape') close();
	}}
/>

<div class="avatar-menu">
	<button
		class="avatar-button"
		on:click={toggleOpen}
		aria-haspopup="menu"
		aria-expanded={isOpen}
		aria-label="Профиль"
	>
		<img src={imageSrc} alt={imageAlt} class="avatar-image" />
	</button>

	{#if isOpen}
		<div class="menu" role="menu">
			<button class="menu-item" role="menuitem" on:click={onEditUser}
				>Редактировать пользователя</button
			>
			<button class="menu-item" role="menuitem" on:click={onViewProfile}
				>Профиль пользователя</button
			>
			<button class="menu-item danger" role="menuitem" on:click={onDeleteUser}
				>Удалить профиль</button
			>
			<div class="separator" aria-hidden="true"></div>
			<button class="menu-item" role="menuitem" on:click={onLogout}>Выйти</button>
		</div>
	{/if}
</div>
