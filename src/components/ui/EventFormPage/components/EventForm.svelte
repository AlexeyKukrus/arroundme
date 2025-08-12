<script lang="ts">
	// EventForm
	
	import ActionButton from '../../../primitive/ActionButton.svelte';
	import FormField from '../../../primitive/FormField.svelte';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let formData = {
		name: '',
		address: '',
		coordinates: '',
		scheduledFor: '',
		description: '',
		activityType: 'party'
	};

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		dispatch('submit', formData);
	};

	const resetForm = () => {
		formData = {
			name: '',
			address: '',
			coordinates: '',
			scheduledFor: '',
			description: '',
			activityType: 'party'
		};
	};
</script>

<form on:submit={handleSubmit}>
	<FormField
		label="Место"
		type="text"
		bind:value={formData.name}
		placeholder="Введите название места"
		required
	/>

	<FormField
		label="Адрес"
		type="text"
		bind:value={formData.address}
		placeholder="Введите адрес"
		required
	/>

	<FormField label="Дата" type="datetime-local" bind:value={formData.scheduledFor} required />

	<FormField
		label="Описание"
		type="textarea"
		bind:value={formData.description}
		placeholder="Введите описание"
	/>

	<ActionButton onCancel={resetForm} submitLabel="Создать" />
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
</style>
