<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
import type { Event } from '@app/models/events/types';
	import { deleteEventByIdMethod, getEventByIdMethod } from '@api/events/[id]/methods';
	import { goto } from '$app/navigation';
	import ConfirmationModal from '@shared/modals/ConfirmationModal/ConfirmationModal.svelte';
	import { confirmationModalOptions } from '@shared/modals/ConfirmationModal/helpers/helpers-options';
import { notifications } from '@shared/stores/notifications/store';

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
	let isConfirmModalOpen = false;

const eventId = $page.params.id as string;

	const fetchEvent = async () => {
		try {
			loading = true;
			const res = await getEventByIdMethod(eventId);
			event = (res as any).event || {};
			eventType = event.category?.name || '';
			badgeColor = `event-type-${event.category?.verbose || ''}`;
		} catch (err) {
			error = 'Не удалось загрузить событие';
			notifications.error('Ошибка загрузки', 'Не удалось загрузить данные события');
		} finally {
			loading = false;
		}
	};
	const goBack = () => goto('/events');
	const openConfirmationModal = () => (isConfirmModalOpen = true);
	const editEvent = () => goto(`/event/${eventId}/edit`);

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
		if (browser) fetchEvent();
	});
</script>

<div class="event-view event-settings">
	<div class="event-go-back">
		<button class="back-button" on:click={goBack}>← Назад</button>
	</div>
	<div class="event-actions">
		<button class="edit-button" on:click={editEvent}> ✏️ Редактировать </button>
		<button class="delete-button" on:click={openConfirmationModal}> 🗑️ Удалить </button>
	</div>
</div>

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
		<img src={`https://aroundme.space/media/${event.category?.mediaId || ''}`} alt={event.name} class="event-view-image" />
		<div class="event-container">
			<div class="event-header">
				<h1>{event.name}</h1>
				<div class="event-meta">
					<span class="event-type {badgeColor}">{eventType}</span>
					{#if event.scheduledFor}
						<span class="event-view-date">{new Date(event.scheduledFor).toLocaleDateString('ru-RU', dateConfig)}</span>
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


