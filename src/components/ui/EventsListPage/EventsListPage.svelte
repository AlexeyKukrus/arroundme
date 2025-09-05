<script lang="ts">
	// EventsListPage
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Event } from '$lib/types/event';
	import { notifications } from '../../../lib/stores/notifications';
	import EventsMap from './components/EventsMap.svelte';
	import EventCard from './components/EventCard.svelte';
	import { getEventsListMethod, type EventsListResponse } from '../../../routes/api/events/methods';

	let events: Event[] = [];
	let isMobile = false;
	let loading = false;

	const getEventsList = async () => {
		loading = true;
		try {
			const response: EventsListResponse = await getEventsListMethod();
			events = response.events || [];
		} catch (error) {
			events = [];
		} finally {
			loading = false;
		}
	};

	onMount(() => {
		getEventsList();
		if (browser) {
			const checkMobile = () => (isMobile = window.matchMedia('(max-width: 1376px)').matches);
			checkMobile();
			window.addEventListener('resize', checkMobile);
			return () => window.removeEventListener('resize', checkMobile);
		}
	});
</script>

<div class="events-list-page">
	<EventsMap {events} />

	{#if loading}
		<div class="loading-message">
			<div class="spinner"></div>
			<p>Загрузка событий...</p>
		</div>
	{:else if events.length}
		<div class={isMobile ? 'events-mobile-list' : 'events-desktop-list'}>
			<div class="events-wrapper">
				{#each events as item}
					<EventCard {item} />
				{/each}
			</div>
		</div>
	{:else}
		<div class="empty-message">Событий не найдено</div>
	{/if}
</div>

<style>
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
</style>
