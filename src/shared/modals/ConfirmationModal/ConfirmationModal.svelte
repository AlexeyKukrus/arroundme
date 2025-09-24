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
	<div
		class="modal-backdrop"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		on:click={handleBackdropClick}
		on:keydown={handleKeydown}
	>
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
