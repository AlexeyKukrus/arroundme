<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import EventForm from '../../../../components/ui/EventFormPage/components/EventForm.svelte';
	import { onMount } from 'svelte';

	// Определяем режим (create/edit) на основе наличия ID в URL
	const eventId = $page.params.id;
	const isEditMode = Boolean(eventId);

	let initialData = {
		name: '',
		address: '',
		coordinates: '',
		scheduledFor: '',
		description: '',
		activityType: 'party'
	};
	let loading = false;

	// Загружаем данные события для редактирования
	onMount(() => {
		const data = {
			event: {
				id: '7bd2fc50-ba69-49c8-b445-d4d8d4a1dd5e',
				name: 'Party',
				description: 'Amazing party',
				activityType: 'party',
				address: '123 Main St',
				coordinates: '55.125324|25.155324',
				scheduledFor: '2025-08-11T18:00:00Z',
				createdAt: '2025-08-11T17:30:10.321034Z',
				updatedAt: null
			}
		};
		initialData = {
			name: data.event.name,
			address: data.event.address,
			coordinates: data.event.coordinates,
			scheduledFor: data.event.scheduledFor.slice(0, 16), // Обрезаем до datetime-local формата
			description: data.event.description || '',
			activityType: data.event.activityType
		};
	});

	const handleSubmit = async (eventData: typeof initialData) => {
		try {
			loading = true;

			const url = isEditMode ? `/api/v1/events/${eventId}` : '/api/v1/events';

			const method = isEditMode ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...eventData,
					scheduledFor: new Date(eventData.scheduledFor).toISOString()
				})
			});

			if (!response.ok) throw new Error('Ошибка сохранения события');

			await goto('/events');
		} catch (error) {
			console.error('Ошибка:', error);
			alert(error instanceof Error ? error.message : 'Не удалось сохранить событие');
		} finally {
			loading = false;
		}
	};
</script>

<div class="event-form-page">
	<h1>{isEditMode ? 'РЕДАКТИРОВАТЬ СОБЫТИЕ' : 'СОЗДАТЬ СОБЫТИЕ'}</h1>

	{#if loading && isEditMode}
		<div class="loader">Загрузка...</div>
	{:else}
		<EventForm {initialData} on:submit={handleSubmit} {isEditMode} />
	{/if}
</div>

<style>
	.event-form-page {
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

	.loader {
		text-align: center;
		padding: 2rem;
	}
</style>
