<script lang="ts">
	// EventCard
	import { goto } from '$app/navigation';
	import type { Event } from '$lib/types/event';
	import { truncateString } from '../../../../helpers/helpers';

	export let item: Event = {
		name: '',
		description: '',
		address: '',
		category: {
			name: '',
			verbose: '',
			mediaId: '',
			id: ''
		}
	};

	let title: string = '';
	let description: string = '';
	let address: string = '';
	let badgeColor: string = '';
	let type: string = '';

	$: {
		title = truncateString(item.name, 25) || '';
		description = truncateString(item.description, 90) || '';
		address = truncateString(item.address, 40) || '';
		badgeColor = `event-type-${item.category.verbose}` || '';
		type = item.category.name || '';
	}
	const handleClick = () => {
		goto(`/event/${item.id}/view`);
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="event-card" on:click={handleClick}>
	<img src={`https://aroundme.space/media/${item.category.mediaId}`} alt={item.name} class="event-image" />
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
