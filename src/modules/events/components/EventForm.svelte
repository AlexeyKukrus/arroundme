<script lang="ts">
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import { formatISOtoString, formatStringToISOString } from '@helpers/helpers.js';
	import { eventTypesDataOptions } from '@helpers/helpers-data-options';
	import { notifications } from '@shared/stores/notifications/store';
	import { Select } from '@shared/ui';
    import { Button } from '@shared/ui';
	import { FormField } from '@shared/ui';
	import type { Event, Category } from '@app/models/events/types';

	export let data: Partial<Event> = { name: '', address: '', description: '', coordinates: '', scheduledFor: '', category: { id: '', name: '', verbose: '', mediaId: '' } };
	export let categories: Category[] = [];
	export let location: { address: string; coords: string } = { address: '', coords: '' };
	export let isEditMode: boolean = false;

	const dispatch = createEventDispatcher<{ submitForm: { formData: Record<string, any> }; openMapModal: void }>();

	let formData: Record<string, any> = {};
	let selectedEventName: string = '';
	let selectedEventAddress: string = '';
	let selectedEventCoords: string = '';
	let selectedEventData: string = '';
	let selectedEventDescription: string = '';
	let selectedEventType: string = '';
	let selectedEventCategoryId: string = '';
	let formErrors: Record<string, string> = {};

	$: {
		if (data.name !== undefined) selectedEventName = data.name || '';
		if (data.description !== undefined) selectedEventDescription = data.description || '';
		if (location.address) { selectedEventAddress = location.address; selectedEventCoords = location.coords; }
		else if (data.address) { selectedEventAddress = data.address; selectedEventCoords = data.coordinates || ''; }
		else { selectedEventAddress = ''; selectedEventCoords = ''; }
		selectedEventData = data.scheduledFor ? formatISOtoString(data.scheduledFor) || '' : '';
		if (data.category?.verbose) { selectedEventType = data.category.verbose; const category = categories.find((i) => i.verbose === data.category?.verbose); selectedEventCategoryId = category?.id || ''; }
		else { selectedEventType = ''; selectedEventCategoryId = ''; }
	}

	$: if (!isEditMode) { selectedEventName = ''; selectedEventAddress = ''; selectedEventCoords = ''; selectedEventData = ''; selectedEventDescription = ''; selectedEventType = ''; selectedEventCategoryId = ''; formErrors = {}; }

	const validateForm = (): boolean => {
		formErrors = {};
		if (!selectedEventName.trim()) formErrors.name = 'Название события обязательно';
		if (!selectedEventCoords) formErrors.coordinates = 'Укажите точку на карте';
		if (!selectedEventAddress.trim()) formErrors.address = 'Адрес обязателен';
		if (!selectedEventData) formErrors.scheduledFor = 'Дата обязательна';
		if (!selectedEventType) formErrors.category = 'Тип события обязателен';
		if (!selectedEventDescription.trim()) formErrors.description = 'Описание обязательно';
		return Object.keys(formErrors).length === 0;
	};

	const submitForm = (e: SubmitEvent) => {
		e.preventDefault();
		if (!validateForm()) { notifications.error('Ошибка валидации', 'Пожалуйста, заполните все обязательные поля'); return; }
		formData = { name: selectedEventName.trim(), address: selectedEventAddress.trim(), scheduledFor: formatStringToISOString(selectedEventData), description: selectedEventDescription.trim(), coordinates: selectedEventCoords, categoryId: selectedEventCategoryId };
		if (isEditMode && data.id) formData.id = data.id;
		notifications.success('Форма отправлена', 'Данные формы успешно подготовлены для отправки');
		dispatch('submitForm', { formData });
	};

	const changeEventType = (e: CustomEvent<string | string[]>) => { const value = Array.isArray(e.detail) ? e.detail[0] : e.detail; selectedEventType = value; const category = categories.find((item) => item.verbose === value); selectedEventCategoryId = category?.id || ''; if (formErrors.category) { delete formErrors.category; formErrors = { ...formErrors }; } };

	const resetForm = () => { formData = {}; selectedEventName = ''; selectedEventAddress = ''; selectedEventData = ''; selectedEventDescription = ''; selectedEventType = ''; selectedEventCategoryId = ''; formErrors = {}; goto('/events'); };
	const openMapModal = () => { dispatch('openMapModal'); };
	const handleNameChange = (e: CustomEvent<string>) => { selectedEventName = e.detail; if (formErrors.name) { delete formErrors.name; formErrors = { ...formErrors }; } };
	const handleAddressChange = (e: CustomEvent<string>) => { selectedEventAddress = e.detail; if (formErrors.address) { delete formErrors.address; formErrors = { ...formErrors }; } };
	const handleDateChange = (e: CustomEvent<string>) => { selectedEventData = e.detail; if (formErrors.scheduledFor) { delete formErrors.scheduledFor; formErrors = { ...formErrors }; } };
	const handleDescriptionChange = (e: CustomEvent<string>) => { selectedEventDescription = e.detail; if (formErrors.description) { delete formErrors.description; formErrors = { ...formErrors }; } };
</script>

<form on:submit={submitForm}>
	<FormField label="Событие *" type="text" value={selectedEventName} placeholder="Введите название события" required on:onChange={handleNameChange} />
	{#if formErrors.name}<div class="error-message">{formErrors.name}</div>{/if}

	<FormField label="Адрес *" type="text" value={selectedEventAddress} placeholder="Введите адрес" required disabled={!selectedEventCoords} on:onChange={handleAddressChange} />
	{#if formErrors.address}<div class="error-message">{formErrors.address}</div>{/if}

	<button type="button" class="map-button" on:click={openMapModal}>🗺️ Указать место на карте</button>

	<FormField label="Дата *" type="datetime-local" value={selectedEventData} required on:onChange={handleDateChange} />
	{#if formErrors.scheduledFor}<div class="error-message">{formErrors.scheduledFor}</div>{/if}

	<Select options={eventTypesDataOptions} selected={selectedEventType ? [selectedEventType] : []} placeholder="Выберите тип события" on:change={changeEventType} />
	{#if formErrors.category}<div class="error-message">{formErrors.category}</div>{/if}

	<FormField label="Описание *" type="textarea" value={selectedEventDescription} placeholder="Введите описание" required on:onChange={handleDescriptionChange} />
	{#if formErrors.description}<div class="error-message">{formErrors.description}</div>{/if}

    <div class="action-buttons">
        <Button type="button" variant="outline" on:click={resetForm} action="cancel">Отмена</Button>
        <Button type="submit">{isEditMode ? 'Сохранить' : 'Создать'}</Button>
    </div>
</form>

