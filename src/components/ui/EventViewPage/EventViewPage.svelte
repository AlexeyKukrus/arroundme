<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Event } from '$lib/types/event';
	import {
		deleteEventByIdMethod,
		getEventByIdMethod
	} from '../../../routes/api/events/[id]/methods';
	import { goto } from '$app/navigation';
	import ConfirmationModal from '../ConfirmationModal/ConfirmationModal.svelte';
	import { confirmationModalOptions } from '../ConfirmationModal/helpers/helpers-options';
	import { notifications } from '../../../lib/stores/notifications';

	const dateConfig: Intl.DateTimeFormatOptions = {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	};
	const modalConfig = confirmationModalOptions.deleteEvent;

	let event: Event = {
		id: '',
		name: '',
		description: '',
		address: '',
		coordinates: '',
		scheduledFor: '',
		createdAt: '',
		category: {
			name: '',
			mediaId: '',
			id: '',
			verbose: ''
		}
	};
	let loading = false;
	let error: string | null = null;
	let badgeColor = '';
	let eventType = '';
	let showEventSettings = true;
	let isConfirmModalOpen = false;

	const eventId = $page.params.id;

	const fetchEvent = async () => {
		try {
			loading = true;
			const res = await getEventByIdMethod(eventId);
			event = res.event || {};
			eventType = event.category?.name || '';
			badgeColor = `event-type-${event.category?.verbose || ''}`;
		} catch (err) {
			error = 'Не удалось загрузить событие';
			notifications.error('Ошибка загрузки', 'Не удалось загрузить данные события');
		} finally {
			loading = false;
		}
	};
	const goBack = () => {
		goto('/events');
	};
	const openConfirmationModal = () => {
		isConfirmModalOpen = true;
	};
	const editEvent = () => {
		goto(`/event/${eventId}/edit`);
	};

	const deleteEvent = async () => {
		try {
			await deleteEventByIdMethod(eventId);
			notifications.success('Событие удалено', 'Событие успешно удалено');
			goBack();
		} catch (err) {
			notifications.error('Ошибка удаления', 'Не удалось удалить событие');
		}
	};

	onMount(() => {
		if (browser) {
			fetchEvent();
		}
	});
</script>

{#if showEventSettings}
	<div class="event-view event-settings">
		<div class="event-go-back">
			<button class="back-button" on:click={goBack}>← Назад</button>
		</div>
		<div class="event-actions">
			<button class="edit-button" on:click={editEvent}> ✏️ Редактировать </button>
			<button class="delete-button" on:click={openConfirmationModal}> 🗑️ Удалить </button>
		</div>
	</div>
{/if}

{#if loading}
	<div class="loading-message">
		<div class="spinner"></div>
		<p>Загрузка события...</p>
	</div>
{:else if error}
	<div class="error-message">
		<p>{error}</p>
		<button class="retry-button" on:click={fetchEvent}>Повторить</button>
	</div>
{:else}
	<div class="event-view">
		<img
			src={`https://aroundme.space/media/${event.category?.mediaId || ''}`}
			alt={event.name}
			class="event-view-image"
		/>

		<div class="event-container">
			<div class="event-header">
				<h1>{event.name}</h1>
				<div class="event-meta">
					<span class="event-type {badgeColor}">{eventType}</span>
					{#if event.scheduledFor}
						<span class="event-view-date">
							{new Date(event.scheduledFor).toLocaleDateString('ru-RU', dateConfig)}
						</span>
					{/if}
				</div>
			</div>

			<div class="mobile-header">
				<h1>{event.name}</h1>
				<div class="event-meta">
					<span class="event-type {badgeColor}">{eventType}</span>
					{#if event.scheduledFor}
						<span class="event-view-date">
							{new Date(event.scheduledFor).toLocaleDateString('ru-RU', dateConfig)}
						</span>
					{/if}
				</div>
			</div>

			{#if event.description}
				<p class="detail-value">{event.description}</p>
			{/if}

			<div class="event-details">
				<div class="detail-row">
					<span class="detail-label">Адрес:</span>
					<span class="detail-value">{event.address}</span>
				</div>
			</div>
		</div>
	</div>
{/if}

<ConfirmationModal bind:isOpen={isConfirmModalOpen} config={modalConfig} on:submit={deleteEvent} />

<style>
	.event-settings {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background: white;
		border-bottom: 1px solid var(--color-border);
	}

	.back-button {
		background: none;
		border: 1px solid var(--color-gray-300);
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s ease;
	}

	.back-button:hover {
		background: var(--color-gray-100);
	}

	.event-actions {
		display: flex;
		gap: 1rem;
	}

	.edit-button {
		background: var(--color-primary);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: background 0.2s ease;
	}

	.edit-button:hover {
		background: #0056b3;
	}

	.delete-button {
		background: var(--color-error);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: background 0.2s ease;
	}

	.delete-button:hover {
		background: #c41230;
	}

	.loading-message {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		gap: 1rem;
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid #e9ecef;
		border-top: 3px solid #0070f3;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loading-message p {
		margin: 0;
		color: #666;
		font-size: 14px;
	}

	.error-message {
		text-align: center;
		padding: 2rem;
		color: var(--color-error);
	}

	.retry-button {
		background: var(--color-primary);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		margin-top: 1rem;
	}

	.retry-button:hover {
		background: #0056b3;
	}
</style>
