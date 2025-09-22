<script lang="ts">
	import EventForm from '@modules/events/components/EventForm.svelte';
	import { onMount } from 'svelte';
	import { getEventByIdMethod } from '@api/events/[id]/methods';
	import { page } from '$app/stores';
	import { getCategoriesListMethod } from '@api/events/categories/methods';
	import MapModal from '@shared/modals/MapModal/MapModal.svelte';
	import { getAddressByCoordsMethod } from '@api/geocode/methods';
	import { notifications } from '@shared/stores/notifications/store';
	import { createEventMethod, updateEventMethod } from '@api/events/methods';
	import { goto } from '$app/navigation';
	import type { Event, Category } from '@app/models/events/types';
	import { PUBLIC_YANDEX_MAPS_API_KEY } from '$env/static/public';

	export let mode: string = 'create';

	let eventId = $page.params.id || '';
	let event: Partial<Event> = {};
	let categories: Category[] = [];
	let title = 'СОЗДАТЬ НОВОЕ СОБЫТИЕ';
	let isEditMode = false;
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
			.catch(() => notifications.error('Ошибка геокодирования', 'Не удалось получить адрес по координатам'));
	};

	const handleSubmitForm = async (event: CustomEvent<{ formData: Record<string, any> }>) => {
		const { formData } = event.detail;
		try {
			if (isEditMode) {
				await updateEventMethod(eventId, formData as Partial<Event>);
				notifications.success('Событие обновлено', 'Событие успешно обновлено');
			} else {
				await createEventMethod(formData as Event);
				notifications.success('Событие создано', 'Событие успешно создано');
			}
			goto('/events');
		} catch (error) {
			console.error('Ошибка при сохранении события:', error);
		}
	};

	$: title = mode === 'create' ? 'СОЗДАТЬ СОБЫТИЕ' : 'РЕДАКТИРОВАТЬ СОБЫТИЕ';
	$: isEditMode = mode === 'edit';

	onMount(async () => {
		try {
			const categoriesResponse = await getCategoriesListMethod();
			categories = categoriesResponse.event_categories || [];
			if (mode === 'edit') {
				const response = await getEventByIdMethod(eventId);
				if (response) {
					event = (response as any).event || {};
					event.id = eventId;
					if (event.coordinates) {
						location.coords = event.coordinates;
						location.address = event.address || '';
					}
				} else {
					notifications.error('Ошибка загрузки', 'Не удалось загрузить данные события для редактирования');
				}
			}
		} catch (error) {
			notifications.error('Ошибка загрузки', 'Не удалось загрузить данные для формы');
		}
	});
</script>

<div class="create-event-page">
	<h1>{title}</h1>
	<EventForm data={event} {isEditMode} {categories} {location} on:submitForm={handleSubmitForm} on:openMapModal={openMapModal} />
</div>

<MapModal bind:isOpen={isMapModalOpen} onClose={() => (isMapModalOpen = false)} onCoordinatesSelect={getAddressByCoords} />


