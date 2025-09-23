<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	import type { Event } from '@app/models/events/types.js';
	import type { EventsListResponse } from '@api/events/methods.js';
	import { getEventsListMethod } from '@api/events/methods.js';
	import { isInBounds } from '@helpers/helpers.js';

	import { EventsList } from '@modules/events/index.js';
	import EventsMap from '@modules/events/components/EventsMap.svelte';

	let events: Event[] = [];
	let filtered: Event[] = [];
	let loading: boolean = false;
	let isMobile: boolean = false;
	let hasBounds: boolean = false;
	let lastBounds: [[number, number], [number, number]] | null = null;

	function handleBoundsChange(
		event: CustomEvent<{
			bounds: [[number, number], [number, number]];
			center: [number, number];
			zoom: number;
		}>
	) {
		const { bounds } = event.detail;
		if (!bounds) return;
		lastBounds = bounds;
		hasBounds = true;
		filtered = events.filter((e) => isInBounds(e.coordinates, bounds));
	}

	async function getEventsList() {
		loading = true;
		try {
			const response: EventsListResponse = await getEventsListMethod();
			events = response.events || [];
			if (lastBounds) {
				filtered = events.filter((e) =>
					isInBounds(e.coordinates, lastBounds as [[number, number], [number, number]])
				);
				hasBounds = true;
			} else {
				filtered = [];
				hasBounds = false;
			}
		} catch (error) {
			events = [];
			filtered = [];
			hasBounds = false;
		} finally {
			loading = false;
		}
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
	<EventsList items={filtered} {loading} {hasBounds} {isMobile} />
</div>
