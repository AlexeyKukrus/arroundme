<script lang="ts">
	import EventForm from './components/EventForm.svelte';
	import { onMount } from 'svelte';
	import { getEventByIdMethod } from '../../../routes/api/events/[id]/methods';
	import { page } from '$app/stores';

	export let mode: string = 'create';

	let eventId = $page.params.id || '';
	let event = {};
	let title = 'СОЗДАТЬ НОВОЕ СОБЫТИЕ';
	let isEditMode = false;

	$: title = mode === 'create' ? 'СОЗДАТЬ СОБЫТИЕ' : 'РЕДАКТИРОВАТЬ СОБЫТИЕ';
	$: isEditMode = mode === 'edit';

	onMount(() => {
		if (mode === 'edit') {
			getEventByIdMethod(eventId).then((res) => {
				event = res.event || {};
				event.id = eventId;
			});
		}
	});
</script>

<div class="create-event-page">
	<h1>{title}</h1>
	<EventForm data={event} {isEditMode} on:submitForm />
</div>

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
