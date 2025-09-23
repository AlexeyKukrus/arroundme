<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Title } from '@shared/ui/index.js';
	import EventForm from '@app/modules/events/components/EventForm.svelte';
	import type { Event, Category } from '@app/models/events/types';
	import { getCategoriesListMethod } from '@api/events/categories/methods';
	import { getEventByIdMethod, updateEventByIdMethod } from '@api/events/[id]/methods';
	import { MapModal } from '@shared/modals';
	import { getAddressByCoordsMethod } from '@api/geocode/methods';
	import { notifications } from '@shared/stores/notifications/store';
	import { PUBLIC_YANDEX_MAPS_API_KEY } from '$env/static/public';

	const eventId = $page.params.id as string;

	let event: Partial<Event> = {};
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
			await updateEventByIdMethod(formData as Event);
			notifications.success('Событие обновлено', 'Событие успешно обновлено');
			goto('/events');
		} catch (error) {
			console.error(error);
		}
	}

	onMount(async () => {
		try {
			const categoriesResponse = await getCategoriesListMethod();
			categories = categoriesResponse.event_categories || [];
			const response = await getEventByIdMethod(eventId);
			if (response) {
				event = (response as any).event || {};
				event.id = eventId;
				if ((event as Event).coordinates) {
					location.coords = (event as Event).coordinates!;
					location.address = (event as Event).address || '';
				}
			} else {
				notifications.error(
					'Ошибка загрузки',
					'Не удалось загрузить данные события для редактирования'
				);
			}
		} catch (error) {
			notifications.error('Ошибка загрузки', 'Не удалось загрузить данные для формы');
		}
	});
</script>

<div class="create-event-page">
	<Title size="lg" text="Редактировать событие" />
	<EventForm
		data={event}
		isEditMode={true}
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

<style>
	.create-event-page {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem;
	}
</style>
