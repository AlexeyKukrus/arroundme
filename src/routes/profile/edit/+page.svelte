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

<section class="edit-profile container-narrow">
	<Title size="lg" text="Редактирование пользователя" />
	<UsersForm {name} on:submitForm={handleSubmitForm} on:cancel={() => goto('/profile')} />
</section>
