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

<style>
	.avatar-menu {
		position: relative;
		display: inline-block;
	}

	.avatar-button {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		overflow: hidden;
		background: transparent;
		padding: 0;
		border: none;
	}

	.avatar-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.menu {
		position: absolute;
		right: 0;
		top: calc(100% + 8px);
		min-width: 220px;
		background: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
		padding: 6px;
		z-index: 200;
	}

	.menu-item {
		width: 100%;
		text-align: left;
		padding: 10px 12px;
		border-radius: 6px;
		color: var(--color-text);
	}

	.menu-item:hover {
		background: var(--color-border);
	}

	.menu-item.danger {
		color: #b00020;
	}

	.separator {
		height: 1px;
		background: var(--color-border);
		margin: 6px 0;
	}
</style>
