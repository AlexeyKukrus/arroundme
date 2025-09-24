<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { notifications } from '@shared/stores/notifications/store';
	import type { Notification as AppNotification } from '@shared/stores/notifications/store';

	const iconByType: Record<AppNotification['type'], string> = {
		success: '✅',
		error: '❌',
		warning: '⚠️',
		info: 'ℹ️'
	};

	const colorClassByType: Record<AppNotification['type'], string> = {
		success: 'notification-success',
		error: 'notification-error',
		warning: 'notification-warning',
		info: 'notification-info'
	};

	function close(id: string) {
		notifications.remove(id);
	}

	function handleAction(notification: AppNotification) {
		if (notification.action) {
			notification.action.onClick();
			close(notification.id);
		}
	}

	function getIcon(notification: AppNotification) {
		return iconByType[notification.type];
	}

	function getColorClass(notification: AppNotification) {
		return colorClassByType[notification.type];
	}
</script>

<div class="notifications-container">
	{#each $notifications.notifications as notification (notification.id)}
		<div
			class="notification-toast {getColorClass(notification)}"
			in:fly={{ y: 50, duration: 300 }}
			out:fade={{ duration: 200 }}
		>
			<div class="notification-header">
				<div class="notification-icon">{getIcon(notification)}</div>
				<div class="notification-content">
					<h4 class="notification-title">{notification.title}</h4>
					<p class="notification-message">{notification.message}</p>
				</div>
				<button class="notification-close" on:click={() => close(notification.id)} title="Закрыть">
					×
				</button>
			</div>

			{#if notification.action}
				<div class="notification-actions">
					<button class="notification-action-btn" on:click={() => handleAction(notification)}>
						{notification.action.label}
					</button>
				</div>
			{/if}

			{#if notification.duration}
				<div class="notification-progress">
					<div
						class="notification-progress-bar"
						style="animation-duration: {notification.duration}ms"
					></div>
				</div>
			{/if}
		</div>
	{/each}
</div>
