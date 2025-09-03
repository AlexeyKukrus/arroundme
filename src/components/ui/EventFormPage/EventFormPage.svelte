<script lang="ts">
	import EventForm from './components/EventForm.svelte';
	import { onMount } from 'svelte';
	import { getEventByIdMethod } from '../../../routes/api/events/[id]/methods';
	import { page } from '$app/stores';
	import { getCategoriesListMethod } from '../../../routes/api/events/categories/methods';
	import MapModal from '../MapModal/MapModal.svelte';
	import { getAddressByCoordsMethod } from '../../../routes/api/geocode/methods';
	import { notifications } from '../../../lib/stores/notifications';
	import { createEventMethod, updateEventMethod } from '../../../routes/api/events/methods';
	import { goto } from '$app/navigation';
	import type { Event, Category } from '$lib/types/event';

	export let mode: string = 'create';

	let eventId = $page.params.id || '';
	let event: Partial<Event> = {};
	let categories: Category[] = [];
	let title = 'СОЗДАТЬ НОВОЕ СОБЫТИЕ';
	let isEditMode = false;
	let isMapModalOpen = false;
	let location = {
		address: '',
		coords: ''
	};

	const openMapModal = () => {
		isMapModalOpen = true;
	};

	const getAddressByCoords = (coords: [number, number]) => {
		const data = {
			apikey: `3491db01-7fa8-4797-add0-9fbd22112c3f`,
			geocode: `${coords[1].toFixed(6)},${coords[0].toFixed(6)}`,
			format: 'json'
		};

		getAddressByCoordsMethod(data)
			.then((res) => {
				const locationsResponse = res || {};
				const featureMember = locationsResponse.featureMember || [];

				if (featureMember.length > 0 && featureMember[0]?.GeoObject) {
					const geoObject = featureMember[0].GeoObject;
					location.address = `${geoObject.description}, ${geoObject.name}`;
					location.coords = coords.join('|'); // Преобразуем в строку для совместимости

					notifications.success('Адрес получен', 'Адрес успешно получен по координатам');
				} else {
					notifications.warning('Адрес не найден', 'Не удалось получить адрес по координатам');
				}
			})
			.catch((err) => {
				console.error(err);
				notifications.error('Ошибка геокодирования', 'Не удалось получить адрес по координатам');
			});
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

			// Перенаправление на список событий
			goto('/events');
		} catch (error) {
			// Ошибки уже обрабатываются в методах API
			console.error('Ошибка при сохранении события:', error);
		}
	};

	$: title = mode === 'create' ? 'СОЗДАТЬ СОБЫТИЕ' : 'РЕДАКТИРОВАТЬ СОБЫТИЕ';
	$: isEditMode = mode === 'edit';

	onMount(async () => {
		try {
			// Загружаем категории для всех случаев
			const categoriesResponse = await getCategoriesListMethod();
			categories = categoriesResponse.event_categories || [];

			// Если режим редактирования, загружаем данные события
			if (mode === 'edit') {
				const response = await getEventByIdMethod(eventId);
				if (response) {
					// Бэкенд возвращает объект-обёртку { event: {...} }
					event = (response as any).event || {};
					event.id = eventId;

					// Инициализируем location данными из события
					if (event.coordinates) {
						location.coords = event.coordinates;
						location.address = event.address || '';
					}
				} else {
					notifications.error(
						'Ошибка загрузки',
						'Не удалось загрузить данные события для редактирования'
					);
				}
			}
		} catch (error) {
			console.error('Ошибка при загрузке данных:', error);
			notifications.error('Ошибка загрузки', 'Не удалось загрузить данные для формы');
		}
	});
</script>

<div class="create-event-page">
	<h1>{title}</h1>
	<EventForm
		data={event}
		{isEditMode}
		{categories}
		{location}
		on:submitForm={handleSubmitForm}
		on:openMapModal={openMapModal}
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

	h1 {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.8rem;
		color: #333;
	}
</style>
