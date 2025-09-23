<script lang="ts">
	// EventsList.svelte
	import type { Event } from '@app/models/events/types';
	import EventCard from '@modules/events/components/EventCard.svelte';

	export let items: Event[] = [];
	export let loading: boolean = false;
	export let hasBounds: boolean = false;
	export let isMobile: boolean = false;
</script>

{#if loading}
	<div class="loading-message">
		<div class="spinner"></div>
		<p>Загрузка событий...</p>
	</div>
{:else if hasBounds}
	{#if items.length}
		<div class={isMobile ? 'events-mobile-list' : 'events-desktop-list'}>
			<div class="events-wrapper">
				{#each items as item}
					<EventCard {item} />
				{/each}
			</div>
		</div>
	{:else}
		<div class="empty-message">Событий не найдено</div>
	{/if}
{/if}