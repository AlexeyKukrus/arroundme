<script lang="ts">
	// EventForm
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import { formatISOtoString, formatStringToISOString } from '../../../../helpers/helpers.js';
	import { eventTypesListOptions } from '../helpers/helpers-options';
	import Select from '../../../primitive/Select.svelte';
	import ActionButton from '../../../primitive/ActionButton.svelte';
	import FormField from '../../../primitive/FormField.svelte';
	import { getAddressByCoordsMethod } from '../../../../routes/api/geocode/methods';

	export let data = {
		name: '',
		address: '',
		description: '',
		coordinates: '',
		scheduledFor: '',
		category: {
			id: '',
			name: '',
			verbose: '',
			mediaId: ''
		}
	};
	export let categories = [];
	export let location = {
		address: '',
		coords: ''
	}
	export let isEditMode: boolean = false;

	const dispatch = createEventDispatcher();

	let formData = {};
	let selectedEventName = '';
	let selectedEventAddress = '';
	let selectedEventCoords = ''
	let selectedEventData = '';
	let selectedEventDescription = '';
	let selectedEventType: string[] = [];
	let selectedEventCategoryId = '';

	$: {
		selectedEventName = data.name || '';
		selectedEventAddress = data.address || '';
		selectedEventDescription = data.description || '';

		if (location.address) {
			console.log(location.address);
			selectedEventAddress = location.address
			selectedEventCoords = location.coords
		} else if (data.address) {
			selectedEventAddress = data.address
			selectedEventCoords = data.coordinates
		} else {
			selectedEventAddress = ''
			selectedEventCoords = ''
		}
		getCoordsByAddress(selectedEventAddress)

		if (data.scheduledFor) {
			selectedEventData = formatISOtoString(data.scheduledFor) || '';
		}
		if (data.category?.name) {
			selectedEventType = [
				eventTypesListOptions.find((item) => item.value === data.category.verbose)
			];
			selectedEventCategoryId = categories.find(
				(item) => item.verbose === data.category.verbose
			)?.id;
		}
	}

	const submitForm = (e: Event) => {
		e.preventDefault();

		formData = {
			name: selectedEventName || '',
			address: selectedEventAddress || '',
			scheduledFor: formatStringToISOString(selectedEventData) || '',
			description: selectedEventDescription || '',
			coordinates: selectedEventCoords,
			categoryId: selectedEventCategoryId || ''
		};

		if (isEditMode) {
			formData.id = data.id;
		}
		dispatch('submitForm', formData);
	};

	const changeEventType = (e) => {
		selectedEventType = [e.detail];
		selectedEventCategoryId = categories.find((item) => item.verbose === e.detail).id;
	};
	const resetForm = () => {
		formData = {};
		selectedEventName = '';
		selectedEventAddress = '';
		selectedEventData = '';
		selectedEventDescription = '';
		selectedEventType = [];

		goto('/events');
	};
	const openMapModal = () => {
		dispatch('openMapModal');
	};
	const getCoordsByAddress = (event) => {
		console.log('Поиск координат для:', event.detail);
		const data = {
			apikey: `3491db01-7fa8-4797-add0-9fbd22112c3f`,
			geocode: event.detail,
			format: "json"
		}
		getAddressByCoordsMethod(data).then((res) => {
			const locationsResponse = res || {}
			const featureMember = locationsResponse.featureMember || []
			const geoObject = featureMember[0].GeoObject
			console.log(geoObject)
			location.address = `${geoObject.description}, ${geoObject.name}`
			location.coords = event
		}).catch((err) => {
			console.log(err);
		})
		// Здесь ваш код для геокодирования
	};
</script>

<form on:submit={submitForm}>
	<FormField
		label="Событие"
		type="text"
		value={selectedEventName}
		placeholder="Введите название события"
		on:onChange={(e) => selectedEventName = e.detail}
	/>

	<FormField
		label="Адрес"
		type="text"
		value={selectedEventAddress}
		placeholder="Введите адрес"
		delay={1000}
		on:onChange={getCoordsByAddress}
	/>
	<button on:click={openMapModal}>Указать место на карте</button>

	<FormField
		label="Дата"
		type="datetime-local"
		value={selectedEventData}
		required
		on:onChange={(e) => selectedEventData = e.detail}
	/>

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
		on:onChange={(e) => selectedEventDescription = e.detail}
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

	button {
		text-align: right;
	}
</style>
