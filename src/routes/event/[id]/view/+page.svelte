<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { EventsView } from '@modules/events';
	import { ConfirmationModal } from '@shared/modals';
	import { confirmationModalOptions } from '@shared/modals/ConfirmationModal/helpers/helpers-options';
	import { Button } from '@shared/ui';
	import type { Event } from '@app/models/events/types';
	import { getEventByIdMethod, deleteEventByIdMethod } from '@api/events/[id]/methods';
	import { notifications } from '@shared/stores/notifications/store';

	const modalConfig = confirmationModalOptions.deleteEvent;

	let event: Event = {
		id: '',
		name: '',
		description: '',
		address: '',
		coordinates: '',
		scheduledFor: '',
		createdAt: '',
		category: { name: '', mediaId: '', id: '', verbose: '' }
	};
	let loading = false;
	let error: string | null = null;
	let badgeColor = '';
	let eventType = '';
	let isConfirmModalOpen = false;

	const eventId = $page.params.id as string;

	async function fetchEvent() {
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
	}

	const goBack = () => goto('/events');
	const openConfirmationModal = () => (isConfirmModalOpen = true);
	const editEvent = () => goto(`/event/${eventId}/edit`);

	async function deleteEvent() {
		try {
			await deleteEventByIdMethod(eventId);
			notifications.success('Событие удалено', 'Событие успешно удалено');
			goBack();
		} catch (err) {
			notifications.error('Ошибка удаления', 'Не удалось удалить событие');
		}
	}

	onMount(() => {
		if (browser) fetchEvent();
	});
</script>

<div class="event-toolbar">
	<Button variant="ghost" size="sm" on:click={goBack}>← Назад</Button>
	<div style="flex:1"></div>
	<Button variant="secondary" size="sm" on:click={editEvent}>✏️ Редактировать</Button>
	<Button variant="danger" size="sm" on:click={openConfirmationModal}>🗑️ Удалить</Button>
</div>

{#if loading}
	<div class="loading-message">
		<div class="spinner"></div>
		<p>Загрузка события...</p>
	</div>
{:else if error}
	<div class="error-message">
		<p>{error}</p>
		<Button variant="secondary" size="sm" on:click={fetchEvent}>Повторить</Button>
	</div>
{:else}
	<EventsView {event} {badgeColor} {eventType} />
{/if}

<ConfirmationModal bind:isOpen={isConfirmModalOpen} config={modalConfig} on:submit={deleteEvent} />