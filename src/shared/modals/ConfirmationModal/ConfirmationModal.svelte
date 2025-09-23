<script lang="ts">
	// ConfirmationModal.svelte
	import { browser } from '$app/environment';
	import { createEventDispatcher, onDestroy } from 'svelte';

	export let isOpen = false;
	export let config: {
		title: string;
		description: string;
		confirmationButtonText: string;
		confirmationButtonType: string;
	} | null = null;

	const dispatch = createEventDispatcher();

	const closeModal = () => {
		isOpen = false;
	};

	const confirmAction = () => {
		dispatch('submit');
		closeModal();
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			closeModal();
		}
	};

	const handleBackdropClick = (event: MouseEvent) => {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	};

	let keydownAttached = false;

	$: if (browser) {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			if (!keydownAttached) {
				window.addEventListener('keydown', handleKeydown);
				keydownAttached = true;
			}
		} else {
			document.body.style.overflow = '';
			if (keydownAttached) {
				window.removeEventListener('keydown', handleKeydown);
				keydownAttached = false;
			}
		}
	}

	onDestroy(() => {
		if (!browser) return;
		document.body.style.overflow = '';
		if (keydownAttached) {
			window.removeEventListener('keydown', handleKeydown);
			keydownAttached = false;
		}
	});
</script>

{#if isOpen && config}
	<div class="modal-backdrop" on:click={handleBackdropClick} tabindex="0">
		<div class="modal-container">
			<button class="close-button" on:click={closeModal} aria-label="Закрыть">
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12 4L4 12M4 4L12 12"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>

			<div class="modal-content">
				<h2 class="modal-title">{config.title}</h2>
				<p class="modal-description">{config.description}</p>

				<div class="modal-actions">
					<button
						class={`confirm-button ${config.confirmationButtonType}`}
						on:click={confirmAction}
					>
						{config.confirmationButtonText}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		animation: fadeIn 0.2s ease-out;
	}

	.modal-container {
		position: relative;
		background: white;
		border-radius: 12px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
		max-width: 500px;
		width: 90%;
		animation: slideIn 0.2s ease-out;
	}

	.close-button {
		position: absolute;
		top: 16px;
		right: 16px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		color: #6b7280;
		transition:
			color 0.2s,
			background-color 0.2s;
	}

	.close-button:hover {
		color: #374151;
		background-color: #f3f4f6;
	}

	.modal-content {
		padding: 32px;
		padding-top: 40px;
	}

	.modal-title {
		margin: 0 0 12px 0;
		font-size: 20px;
		font-weight: 600;
		color: #111827;
	}

	.modal-description {
		margin: 0 0 24px 0;
		color: #6b7280;
		line-height: 1.5;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
	}

	.confirm-button {
		padding: 10px 16px;
		border-radius: 6px;
		font-weight: 500;
		cursor: pointer;
		transition:
			background-color 0.2s,
			color 0.2s;
	}

	.type-alert {
		background-color: #ef4444;
		border: none;
		color: white;
	}

	.type-alert:hover {
		background-color: #dc2626;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-20px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>

