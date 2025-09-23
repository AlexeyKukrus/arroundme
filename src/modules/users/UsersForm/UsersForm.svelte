<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { FormField, Button } from '@shared/ui';

	export let name: string = '';

	const dispatch = createEventDispatcher<{ submitForm: { name: string }; cancel: void }>();

	let localName: string = name;

	const handleNameChange = (e: CustomEvent<string>) => {
		localName = e.detail;
	};

	const onSubmit = () => {
		const trimmed = (localName || '').trim();
		if (!trimmed) return;
		dispatch('submitForm', { name: trimmed });
	};

	const onCancel = () => dispatch('cancel');
</script>

<form class="form" on:submit|preventDefault={onSubmit}>
	<FormField
		label="Имя"
		type="text"
		value={localName}
		placeholder="Введите имя"
		on:onChange={handleNameChange}
	/>

	<div class="actions">
		<Button type="submit">Сохранить</Button>
		<Button type="button" variant="outline" on:click={onCancel}>Отмена</Button>
	</div>
</form>
