<script lang="ts">
	import type { Event } from '@app/models/events/types';

	export let event!: Event;
	export let badgeColor: string = '';
	export let eventType: string = '';

	const dateConfig: Intl.DateTimeFormatOptions = {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	};
</script>

<div class="event-view">
	<img
		src={`https://aroundme.space/media/${event.category?.mediaId || ''}`}
		alt={event.name}
		class="event-view-image"
	/>
	<div class="event-container">
		<div class="event-header">
			<h1>{event.name}</h1>
			<div class="event-meta">
				<span class="event-type {badgeColor}">{eventType}</span>
				{#if event.scheduledFor}
					<span class="event-view-date"
						>{new Date(event.scheduledFor).toLocaleDateString('ru-RU', dateConfig)}</span
					>
				{/if}
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
