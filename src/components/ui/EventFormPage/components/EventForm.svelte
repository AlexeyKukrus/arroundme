<script lang="ts">
	import ActionButton from '../../../primitive/ActionButton.svelte';
	import FormField from '../../../primitive/FormField.svelte';
	import { createEventDispatcher } from 'svelte';

	export let initialData: {
		name: string;
		address: string;
		coordinates: string;
		scheduledFor: string;
		description: string;
		activityType: string;
	};

	export let isEditMode = false;

	const dispatch = createEventDispatcher();

	let formData = initialData;

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		dispatch('submit', formData);
	};

	const resetForm = () => {
		formData = initialData;
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

	<ActionButton onCancel={resetForm} submitLabel={isEditMode ? 'Сохранить' : 'Создать'} />
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
</style>
