<script lang="ts">
	import EventForm from './components/EventForm.svelte';
	import { onMount } from 'svelte';
	import { getEventByIdMethod } from '../../../routes/api/events/[id]/methods';
	import { page } from '$app/stores';
	import { getCategoriesListMethod } from '../../../routes/api/events/categories/methods';
	import MapModal from '../MapModal/MapModal.svelte';
	import { getAddressByCoordsMethod } from '../../../routes/api/geocode/methods';

	export let mode: string = 'create';

	let eventId = $page.params.id || '';
	let event = {};
	let categories = [];
	let title = 'СОЗДАТЬ НОВОЕ СОБЫТИЕ';
	let isEditMode = false;
	let isMapModalOpen = false;
	let location = {
		address: '',
		coords: '',
	}

	const openMapModal = () => {
		isMapModalOpen = true;
	};
	const getAddressByCoords = (event) => {
			const data = {
				apikey: `3491db01-7fa8-4797-add0-9fbd22112c3f`,
				geocode: `${event[1].toFixed(6)},${event[0].toFixed(6)}`,
				format: "json"
		}
		console.log(data)
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
	}

	$: title = mode === 'create' ? 'СОЗДАТЬ СОБЫТИЕ' : 'РЕДАКТИРОВАТЬ СОБЫТИЕ';
	$: isEditMode = mode === 'edit';

	onMount(() => {
		if (mode === 'edit') {
			getEventByIdMethod(eventId).then((res) => {
				event = res.event || {};
				event.id = eventId;
			});
		}
		getCategoriesListMethod().then((res) => {
			categories = res.event_categories || [];
		});
	});
</script>

<div class="create-event-page">
	<h1>{title}</h1>
	<EventForm
		data={event}
		{isEditMode}
		{categories}
		{location}
		on:submitForm on:openMapModal={openMapModal} />
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
