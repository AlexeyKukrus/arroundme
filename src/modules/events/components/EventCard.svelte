<script lang="ts">
	// EventCard
	import { goto } from '$app/navigation';
	import type { Event } from '@app/models/events/types';
	import { truncateString } from '@helpers/helpers';

	export let item: Event;

	let title = truncateString(item?.name || '', 25) || '';
	let description = truncateString(item?.description || '', 90) || '';
	let address = truncateString(item?.address || '', 40) || '';
	let badgeColor = `event-type-${item?.category?.verbose || ''}`;
	let type = item?.category?.name || '';

	const handleClick = () => goto(`/event/${item.id}/view`);
</script>

<div class="event-card" on:click={handleClick}>
	<img
		src={`https://aroundme.space/media/${item.category.mediaId}`}
		alt={item.name}
		class="event-image"
	/>
	<div class="event-card-content">
		<h3>{title}</h3>
		{#if item.scheduledFor}
			<div class="event-date">
				<span class="m-right-5">{new Date(item.scheduledFor).toLocaleDateString()}</span>
				<span class="event-type {badgeColor}">{type}</span>
			</div>
		{/if}
		{#if item.address}
			<div class="event-location">📍 {address}</div>
		{/if}
		{#if item.description}
			<p class="event-description">{description}</p>
		{/if}
	</div>
</div>
