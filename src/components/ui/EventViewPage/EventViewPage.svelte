<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Event } from '$lib/types/event';
	import {
		deleteEventByIdMethod,
		getEventByIdMethod
	} from '../../../routes/api/events/[id]/methods';
	import ActionButton from '../../primitive/ActionButton.svelte';
	import { goto } from '$app/navigation';
	import ConfirmationModal from '../ConfirmationModal/ConfirmationModal.svelte';
	import { confirmationModalOptions } from '../ConfirmationModal/helpers/helpers-options';

	const dateConfig = {
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

	const fetchEvent = () => {
		getEventByIdMethod(eventId).then((res) => {
			event = res.event || {};
			eventType = event.category.name;
			badgeColor = `event-type-${event.category.verbose}`;
		});
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
	const deleteEvent = () => {
		deleteEventByIdMethod(eventId).then(() => {
			goBack();
		});
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
			<button on:click={goBack}>Назад</button>
		</div>
		<div>
			<ActionButton
				onCancel={openConfirmationModal}
				onSubmit={editEvent}
				submitLabel="Редактировать"
				cancelLabel="Удалить"
			/>
		</div>
	</div>
{/if}
<div class="event-view">
	<img
		src={`https://aroundme.space/media/${event.category.mediaId}`}
		alt={event.name}
		class="event-view-image"
	/>

	<div class="event-container">
		<div class="event-header">
			<h1>{event.name}</h1>
			<div class="event-meta">
				<span class="event-type {badgeColor}">{eventType}</span>
				<span class="event-view-date">
					{new Date(event.scheduledFor).toLocaleDateString('ru-RU', dateConfig)}
				</span>
			</div>
		</div>

		<div class="mobile-header">
			<h1>{event.name}</h1>
			<div class="event-meta">
				<span class="event-type {badgeColor}">{eventType}</span>
				<span class="event-view-date">
					{new Date(event.scheduledFor).toLocaleDateString('ru-RU', dateConfig)}
				</span>
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

<ConfirmationModal bind:isOpen={isConfirmModalOpen} config={modalConfig} on:submit={deleteEvent} />
