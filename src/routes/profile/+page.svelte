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

<section class="profile container-narrow">
	{#if current}
		<Title size="lg" text="Профиль пользователя" />
		<UsersView user={current} {formatDate}>
			<Button slot="edit" variant="primary" on:click={toEdit}>Редактировать</Button>
		</UsersView>
	{:else}
		<p>Пользователь не найден.</p>
	{/if}
</section>
