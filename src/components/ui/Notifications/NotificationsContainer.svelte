<script lang="ts">
	import { notifications } from '$lib/stores/notifications';
	import NotificationToast from './NotificationToast.svelte';
</script>

<div class="notifications-container">
	{#each $notifications.notifications as notification (notification.id)}
		<NotificationToast {notification} />
	{/each}
</div>

<style>
	.notifications-container {
		position: fixed;
		top: 20px;
		right: 20px;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: 8px;
		pointer-events: none;
	}

	.notifications-container > :global(*) {
		pointer-events: auto;
	}

	@media (max-width: 768px) {
		.notifications-container {
			top: 10px;
			right: 10px;
			left: 10px;
		}

		.notifications-container > :global(*) {
			min-width: auto;
			max-width: none;
		}
	}
</style>
