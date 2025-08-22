<script lang="ts">
	import EventForm from './components/EventForm.svelte';
	import { onMount } from 'svelte';
	import { getEventByIdMethod } from '../../../routes/api/events/[id]/methods';
	import { page } from '$app/stores';
	import { getCategoriesListMethod } from '../../../routes/api/events/categories/methods';
	import MapModal from '../MapModal/MapModal.svelte';

	export let mode: string = 'create';

	let eventId = $page.params.id || '';
	let event = {};
	let categories = [];
	let title = 'СОЗДАТЬ НОВОЕ СОБЫТИЕ';
	let isEditMode = false;
	let isMapModalOpen = false;

	const openMapModal = () => {
		isMapModalOpen = true;
	};

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
	<EventForm data={event} {isEditMode} {categories} on:submitForm on:openMapModal={openMapModal} />
</div>

<MapModal
	bind:isOpen={isMapModalOpen}
	onClose={() => (isMapModalOpen = false)}
	onCoordinatesSelect={(item) => console.log('item', item)}
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
