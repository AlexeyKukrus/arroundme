<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Event } from '$lib/types/event';
	import { getEventByIdMethod } from '../../../routes/api/events/methods';

	let event: Event = {
		id: '',
		name: '',
		description: '',
		activityType: '',
		address: '',
		coordinates: '',
		scheduledFor: '',
		createdAt: ''
	};
	let loading = false;
	let error: string | null = null;

	const eventId = $page.params.id;

	const fetchEvent = () => {
		const data = {
			event: {
				id: '9153e83e-e7aa-4e64-8704-8c466315c59a',
				name: 'ООООЧЕНЬ КРУТАЯ ВЕЧЕРИНКА',
				description:
					'Это текст для проверки переполнения. Будет большое описание о том как круто будет на этой вечеринке. Это текст для проверки переполнения. Будет большое описание о том как круто будет на этой вечеринке. Это текст для проверки переполнения. Будет большое описание о том как круто будет на этой вечеринке. Это текст для проверки переполнения. Будет большое описание о том как круто будет на этой вечеринке. Это текст для проверки переполнения. Будет большое описание о том как круто будет на этой вечеринке. Это текст для проверки переполнения. Будет большое описание о том как круто будет на этой вечеринке. Это текст для проверки переполнения. Будет большое описание о том как круто будет на этой вечеринке.',
				activityType: 'party',
				address: 'Москва, Привольная 65',
				coordinates: '55.689639|37.848987',
				scheduledFor: '2025-08-20T18:00:00Z',
				createdAt: '2025-08-12T17:00:56.740401Z'
			}
		};
		getEventByIdMethod(eventId).then((res) => {
			console.log(res)
		})
		event = data.event;
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
				<span class="event-type">{event.activityType}</span>
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
				<span class="event-type">{event.activityType}</span>
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