<script lang="ts">
	// EventsListPage
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Event } from '$lib/types/event';
	import EventsMap from './components/EventsMap.svelte';
	import EventCard from './components/EventCard.svelte';

	let events: Event[] = [];
	let isMobile = false;
	let loading = true;

	const getEventsList = async () => {
		loading = true;
		try {
			const response = await fetch('/api/events');
			if (!response.ok) throw new Error('Ошибка загрузки');
			events = (await response.json()).events || [];
		} catch (err) {
			console.error('Ошибка:', err);
		} finally {
			loading = false;
		}
	};

	onMount(() => {
		getEventsList();
		if (browser) {
			const checkMobile = () => (isMobile = window.matchMedia('(max-width: 1024px)').matches);
			checkMobile();
			window.addEventListener('resize', checkMobile);
			return () => window.removeEventListener('resize', checkMobile);
		}
	});
</script>

<div class="events-list-page">
	<EventsMap {events} />

	{#if !loading && events.length}
		<div class={isMobile ? 'events-mobile-list' : 'events-desktop-list'}>
			<div class="events-wrapper">
				{#each events as item}
					<EventCard {item} />
				{/each}
			</div>
		</div>
	{:else if !loading}
		<div class="empty-message">Событий не найдено</div>
	{/if}
</div>
