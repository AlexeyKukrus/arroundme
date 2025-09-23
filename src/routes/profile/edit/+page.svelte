<script lang="ts">
	import { user } from '@app/models/users/store';
	import { goto } from '$app/navigation';
	import { Title } from '@shared/ui';
	import { UsersForm } from '@modules/users';

	let name: string = $user?.name ?? '';

	const handleSubmitForm = (e: CustomEvent<{ name: string }>) => {
		const { name } = e.detail;
		user.updateName(name);
		goto('/profile');
	};
</script>

<section class="edit-profile">
	<Title size="lg" text="Редактирование пользователя" />
	<UsersForm {name} on:submitForm={handleSubmitForm} on:cancel={() => goto('/profile')} />

	<style>
		.edit-profile {
			max-width: 720px;
			margin: 2rem auto;
			padding: 0 1rem;
		}
		.title {
			margin-bottom: 1rem;
		}
		.form {
			border: 1px solid var(--color-border);
			border-radius: 8px;
			padding: 1rem;
		}
		.actions {
			display: flex;
			gap: 0.5rem;
		}
	</style>
</section>
