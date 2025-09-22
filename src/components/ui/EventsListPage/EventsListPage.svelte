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
	let filtered: Event[] = [];
	let isMobile = false;
	let loading = false;
	let hasBounds = false;
	let lastBounds: [[number, number], [number, number]] | null = null;

	function parseCoordinates(coordString: string): [number, number] | null {
		if (!coordString) return null;
		const coords = coordString.split('|').map(Number);
		if (coords.length !== 2 || coords.some(isNaN)) return null;
		return [coords[0], coords[1]];
	}

	function isInBounds(e: Event, bounds: [[number, number], [number, number]]): boolean {
		if (!e.coordinates) return false;
		const coords = parseCoordinates(e.coordinates);
		if (!coords) return false;
		const [[minLat, minLon], [maxLat, maxLon]] = bounds;
		const [lat, lon] = coords;
		return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
	}

	const getEventsList = async () => {
		loading = true;
		try {
			const response: EventsListResponse = await getEventsListMethod();
			events = response.events || [];
			if (lastBounds) {
				filtered = events.filter((e) => isInBounds(e, lastBounds as [[number, number], [number, number]]));
			} else {
				filtered = [];
			}
		} catch (error) {
			events = [];
			filtered = [];
		} finally {
			loading = false;
		}
	};

	function handleBoundsChange(event: CustomEvent<{ bounds: [[number, number], [number, number]]; center: [number, number]; zoom: number }>) {
		const { bounds } = event.detail;
		if (!bounds) return;
		lastBounds = bounds;
		hasBounds = true;
		filtered = events.filter((e) => isInBounds(e, bounds));
	}

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
	<EventsMap {events} on:boundsChange={handleBoundsChange} />

	{#if loading}
		<div class="loading-message">
			<div class="spinner"></div>
			<p>Загрузка событий...</p>
		</div>
	{:else if hasBounds}
		{#if filtered.length}
			<div class={isMobile ? 'events-mobile-list' : 'events-desktop-list'}>
				<div class="events-wrapper">
					{#each filtered as item}
						<EventCard {item} />
					{/each}
				</div>
			</div>
		{:else}
			<div class="empty-message">Событий не найдено</div>
		{/if}
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
