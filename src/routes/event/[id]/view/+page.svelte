<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let event: any = null;
	let loading = false;
	let error: string | null = null;

	// Получаем ID события из URL
	const eventId = $page.params.id;

	// Функция для загрузки данных события
	const fetchEvent = () => {
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
		event = data.event;
	};

	onMount(() => {
		if (browser) {
			fetchEvent();
		}
	});
</script>

<div class="event-view">
	{#if loading}
		<div class="loader">Загрузка события...</div>
	{:else if error}
		<div class="error">{error}</div>
	{:else if event}
		<div class="event-header">
			<h1>{event.name}</h1>
			<div class="event-meta">
				<span class="event-type">{event.activityType}</span>
				<span class="event-date">
					{new Date(event.scheduledFor).toLocaleDateString('ru-RU', {
						day: 'numeric',
						month: 'long',
						year: 'numeric',
						hour: '2-digit',
						minute: '2-digit'
					})}
				</span>
			</div>
		</div>

		<div class="event-details">
			<div class="detail-row">
				<span class="detail-label">Адрес:</span>
				<span class="detail-value">{event.address}</span>
			</div>

			{#if event.description}
				<div class="detail-row">
					<span class="detail-label">Описание:</span>
					<p class="detail-value">{event.description}</p>
				</div>
			{/if}
		</div>
	{:else}
		<div class="empty">Событие не найдено</div>
	{/if}
</div>

<style>
	.event-view {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 1rem;
	}

	.event-header {
		margin-bottom: 1.5rem;
	}

	.event-header h1 {
		margin: 0 0 0.5rem 0;
		font-size: 1.8rem;
	}

	.event-meta {
		display: flex;
		gap: 1rem;
		color: #666;
		font-size: 0.9rem;
	}

	.event-type {
		text-transform: capitalize;
		padding: 0.2rem 0.5rem;
		background: #f0f0f0;
		border-radius: 4px;
	}

	.event-map {
		height: 300px;
		margin-bottom: 1.5rem;
		border-radius: 8px;
		overflow: hidden;
	}

	.event-details {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.detail-row {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.detail-label {
		font-weight: 500;
		color: #444;
	}

	.detail-value {
		color: #333;
	}

	.loader,
	.error,
	.empty {
		text-align: center;
		padding: 2rem;
	}

	.error {
		color: #d32f2f;
	}

	@media (min-width: 1024px) {
		.event-view {
			max-width: 1200px;
			margin: 0 auto;
			padding: 2rem;
		}

		.event-map {
			height: 400px;
		}

		.event-details {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1.5rem;
		}
	}
</style>
