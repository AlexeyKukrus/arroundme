<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Title, Button } from '@shared/ui';
	import { user as userStore, type UserProfile } from '@app/models/users/store';
	import { UsersView } from '@modules/users';

	let current: UserProfile | null = null;
	const formatDate = (iso: string) => new Date(iso).toLocaleString();

	onMount(() => {
		if (!browser) return;
		current = userStore.initIfEmpty();
	});

	const toEdit = () => goto('/profile/edit');
</script>

<section class="profile">
	{#if current}
		<Title size="lg" text="Профиль пользователя" />
		<UsersView user={current} {formatDate}>
			<Button slot="edit" variant="primary" on:click={toEdit}>Редактировать</Button>
		</UsersView>
	{:else}
		<p>Пользователь не найден.</p>
	{/if}
	<style>
		.profile {
			max-width: 720px;
			margin: 2rem auto;
			padding: 0 1rem;
		}
		.title {
			margin-bottom: 1rem;
		}
		.card {
			border: 1px solid var(--color-border);
			border-radius: 8px;
			padding: 1rem;
		}
		.row {
			display: flex;
			gap: 0.5rem;
			padding: 0.5rem 0;
		}
		.label {
			width: 120px;
			color: var(--color-text);
			opacity: 0.7;
		}
		.value {
			flex: 1;
		}
		.actions {
			margin-top: 1rem;
		}
	</style>
</section>
