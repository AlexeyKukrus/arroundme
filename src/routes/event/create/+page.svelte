<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Title } from '@shared/ui/index.js';
	import EventForm from '@app/modules/events/components/EventForm.svelte';
	import type { Event, Category } from '@app/models/events/types';
	import { getCategoriesListMethod } from '@api/events/categories/methods';
	import { createEventMethod } from '@api/events/methods';
	import { MapModal } from '@shared/modals';
	import { getAddressByCoordsMethod } from '@api/geocode/methods';
	import { notifications } from '@shared/stores/notifications/store';
	import { PUBLIC_YANDEX_MAPS_API_KEY } from '$env/static/public';

	let categories: Category[] = [];
	let isMapModalOpen = false;
	let location = { address: '', coords: '' };

	const openMapModal = () => (isMapModalOpen = true);

	const getAddressByCoords = (coords: [number, number]) => {
		const data = {
			apikey: PUBLIC_YANDEX_MAPS_API_KEY,
			geocode: `${coords[1].toFixed(6)},${coords[0].toFixed(6)}`,
			format: 'json'
		};
		getAddressByCoordsMethod(data)
			.then((res) => {
				const featureMember = (res || {}).featureMember || [];
				if (featureMember.length > 0 && featureMember[0]?.GeoObject) {
					const geoObject = featureMember[0].GeoObject;
					location.address = `${geoObject.description}, ${geoObject.name}`;
					location.coords = coords.join('|');
					notifications.success('Адрес получен', 'Адрес успешно получен по координатам');
				} else {
					notifications.warning('Адрес не найден', 'Не удалось получить адрес по координатам');
				}
			})
			.catch(() =>
				notifications.error('Ошибка геокодирования', 'Не удалось получить адрес по координатам')
			);
	};

	async function handleSubmitForm(e: CustomEvent<{ formData: Record<string, any> }>) {
		const { formData } = e.detail;
		try {
			await createEventMethod(formData as Event);
			notifications.success('Событие создано', 'Событие успешно создано');
			goto('/events');
		} catch (error) {
			console.error(error);
		}
	}

	onMount(async () => {
		try {
			const categoriesResponse = await getCategoriesListMethod();
			categories = categoriesResponse.event_categories || [];
		} catch (error) {
			notifications.error('Ошибка загрузки', 'Не удалось загрузить категории');
		}
	});
</script>

<div class="create-event-page container-form">
	<Title size="lg" text="Создать событие" />
	<EventForm
		{categories}
		{location}
		on:openMapModal={openMapModal}
		on:submitForm={handleSubmitForm}
	/>
</div>

<MapModal
	bind:isOpen={isMapModalOpen}
	onClose={() => (isMapModalOpen = false)}
	onCoordinatesSelect={getAddressByCoords}
/>
