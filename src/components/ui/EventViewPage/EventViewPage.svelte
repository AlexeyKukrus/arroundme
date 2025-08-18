<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Event } from '$lib/types/event';
	import { getEventByIdMethod } from '../../../routes/api/events/[id]/methods';

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

	const eventId = $page.params.id;

	const fetchEvent = () => {
		getEventByIdMethod(eventId).then((res) => {
			event = res.event || {};
			eventType = event.category.name;
			badgeColor = `event-type-${event.category.verbose}`;
		});
	};

	onMount(() => {
		if (browser) {
			fetchEvent();
		}
	});
</script>

<div class="event-view">
	<img src={'../../event.jpg'} alt={event.name} class="event-view-image" />

	<div class="event-container">
		<div class="event-header">
			<h1>{event.name}</h1>
			<div class="event-meta">
				<span class="event-type {badgeColor}">{eventType}</span>
				<span class="event-view-date">
					<!-- TODO! -->
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

		<div class="mobile-header">
			<h1>{event.name}</h1>
			<div class="event-meta">
				<span class="event-type {badgeColor}">{eventType}</span>
				<span class="event-view-date">
					<!-- TODO! -->
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
