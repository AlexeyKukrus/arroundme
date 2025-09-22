<script lang="ts">
		import { fade, fly } from 'svelte/transition';
	import { notifications } from '@shared/stores/notifications/store';

	function close(id: string) {
		notifications.remove(id);
	}

	function handleAction(notification: Notification) {
		if (notification.action) {
			notification.action.onClick();
			close(notification.id);
		}
	}

	function getIcon(notification: Notification) {
		return {
			success: '✅',
			error: '❌',
			warning: '⚠️',
			info: 'ℹ️'
		}[notification.type];
	}

	function getColorClass(notification: Notification) {
		return {
			success: 'notification-success',
			error: 'notification-error',
			warning: 'notification-warning',
			info: 'notification-info'
		}[notification.type];
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
				<button class="notification-close" on:click={() => close(notification.id)} title="Закрыть"> × </button>
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

	.notification-toast {
		position: relative;
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		padding: 16px;
		margin-bottom: 12px;
		min-width: 300px;
		max-width: 400px;
		border-left: 4px solid;
	}

	.notification-header {
		display: flex;
		align-items: flex-start;
		gap: 12px;
	}

	.notification-icon {
		font-size: 20px;
		flex-shrink: 0;
	}

	.notification-content { flex: 1; min-width: 0; }
	.notification-title { margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #333; }
	.notification-message { margin: 0; font-size: 13px; color: #666; line-height: 1.4; }

	.notification-close {
		background: none;
		border: none;
		font-size: 18px;
		color: #999;
		cursor: pointer;
		padding: 0;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.notification-close:hover { background: #f0f0f0; color: #666; }

	.notification-actions { margin-top: 12px; display: flex; gap: 8px; }
	.notification-action-btn { background: #0070f3; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer; transition: background 0.2s ease; }
	.notification-action-btn:hover { background: #0056b3; }

	.notification-progress { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: rgba(0, 0, 0, 0.1); border-radius: 0 0 8px 8px; overflow: hidden; }
	.notification-progress-bar { height: 100%; background: currentColor; animation: progress-shrink linear forwards; }

	@keyframes progress-shrink { from { width: 100%; } to { width: 0%; } }

	.notification-success { border-left-color: #28a745; color: #28a745; }
	.notification-error { border-left-color: #dc3545; color: #dc3545; }
	.notification-warning { border-left-color: #ffc107; color: #856404; }
	.notification-info { border-left-color: #17a2b8; color: #17a2b8; }
</style>

