<script lang="ts">
	import { goto } from '$app/navigation';
	import EventForm from './components/EventForm.svelte';

	const handleSubmit = async (eventData: any) => {
		try {
			const response = await fetch('https://aroundme.space/api/v1/events', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(eventData)
			});

			if (!response.ok) throw new Error('Ошибка создания события');

			await goto('/events');
		} catch (error) {
			console.error('Ошибка:', error);
			alert('Не удалось создать событие');
		}
	};
</script>

<div class="create-event-page">
	<h1>СОЗДАТЬ СОБЫТИЕ</h1>
	<EventForm on:submit={handleSubmit} />
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
