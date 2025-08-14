<script lang="ts">
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import { formatISOtoString, formatStringToISOString } from '../../../../helpers/helpers.js';
	import { eventTypesListOptions } from '../helpers/helpers-options';
	import Select from '../../../primitive/Select.svelte';
	import ActionButton from '../../../primitive/ActionButton.svelte';
	import FormField from '../../../primitive/FormField.svelte';

	export let data = {
		name: '',
		address: '',
		activityType: '',
		description: '',
		coordinates: '',
		scheduledFor: '',
	};
	export let isEditMode = false;

	const dispatch = createEventDispatcher();

	let formData = {};
	let selectedEventName = '';
	let selectedEventAddress = '';
	let selectedEventData = '';
	let selectedEventDescription = '';
	let selectedEventType: string[] = [];

	$: {
		selectedEventName = data.name || '';
		selectedEventAddress = data.address || '';
		selectedEventDescription = data.description || '';

		if (data.scheduledFor) {
			selectedEventData = formatISOtoString(data.scheduledFor) || '';
		}

		if (data.activityType) {
			selectedEventType = [data.activityType]
		}
	}

	const submitForm = (e: Event) => {
		e.preventDefault();
		console.log(selectedEventType);
		formData = {
			name: selectedEventName || '',
			address: selectedEventAddress || '',
			scheduledFor: formatStringToISOString(selectedEventData) || '',
			description: selectedEventDescription || '',
			activityType: selectedEventType[0] || null,
			coordinates: '55.752004|37.617734'
		};

		if (isEditMode) {
			formData.id = data.id;
		}
		dispatch('submitForm', formData);
	};

	const changeEventType = (e) => {
		selectedEventType = [e.detail]

	}
	const resetForm = () => {
		formData = {};
		selectedEventName = '';
		selectedEventAddress = '';
		selectedEventData = '';
		selectedEventDescription = '';
		selectedEventType = [];

		goto('/events');
	};
</script>

<form on:submit={submitForm}>
	<FormField
		label="Событие"
		type="text"
		bind:value={selectedEventName}
		placeholder="Введите название события"
		required
	/>

	<FormField
		label="Адрес"
		type="text"
		bind:value={selectedEventAddress}
		placeholder="Введите адрес"
		required
	/>

	<FormField label="Дата" type="datetime-local" bind:value={selectedEventData} required />

	<Select
		options={eventTypesListOptions}
		bind:selected={selectedEventType}
		placeholder="Выберите тип события"
		on:change={changeEventType}
	/>

	<FormField
		label="Описание"
		type="textarea"
		bind:value={selectedEventDescription}
		placeholder="Введите описание"
	/>

	<ActionButton
		onCancel={resetForm}
		onSubmit={submitForm}
		submitLabel={isEditMode ? 'Сохранить' : 'Создать'}
	/>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
</style>
