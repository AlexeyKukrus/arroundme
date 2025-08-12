<script lang="ts">
	// EventCard
	import { goto } from '$app/navigation';
	import type { Event } from '$lib/types/event';
	import { handlers } from 'svelte/legacy';
	export let item: Event = {};

	const handleClick = () => {
		goto(`/event/${item.id}/view`);
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="event-card" on:click={handleClick}>
	<img src={'event.jpg'} alt={item.name} class="event-image" />
	<div class="event-card-content">
		<h3>{item.name}</h3>
		{#if item.scheduledFor}
			<div class="event-date">
				{new Date(item.scheduledFor).toLocaleDateString()}
			</div>
		{/if}
		{#if item.address}
			<div class="event-location">📍 {item.address}</div>
		{/if}
		{#if item.description}
			<p class="event-description">{item.description}</p>
		{/if}
	</div>
</div>
