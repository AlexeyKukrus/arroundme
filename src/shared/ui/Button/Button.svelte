<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type ButtonType = 'button' | 'submit' | 'reset';
	type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
	type ButtonSize = 'sm' | 'md' | 'lg';

	export let type: ButtonType = 'button';
	export let variant: ButtonVariant = 'primary';
	export let size: ButtonSize = 'md';
	export let disabled: boolean = false;
	export let fullWidth: boolean = false;

	// Text label fallback; slot has priority
	export let label: string = '';

	// Optional semantic action to dispatch upward (e.g., 'cancel', 'submit', 'delete')
	export let action: string | null = null;

	const dispatch = createEventDispatcher<any>();

	function handleClick(e: MouseEvent) {
		if (disabled) {
			e.preventDefault();
			return;
		}
		dispatch('click', e);
		if (action) {
			dispatch('action', { action });
			(dispatch as any)(action);
		}
	}

	$: classes = [
		'btn',
		`btn-${variant}`,
		`btn-${size}`,
		fullWidth ? 'btn-block' : ''
	].filter(Boolean).join(' ');
</script>

<button class={classes} {type} {disabled} on:click={handleClick}>
	<slot>{label}</slot>
</button>

<style>
	.btn {
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
		border: 1px solid transparent;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.btn-sm { padding: 0.5rem 0.9rem; font-size: 0.9rem; }
	.btn-md { padding: 0.75rem 1.5rem; font-size: 1rem; }
	.btn-lg { padding: 1rem 1.75rem; font-size: 1.05rem; }

	.btn-block { width: 100%; }

	.btn-primary { background: var(--color-green-500); color: var(--color-white); border-color: var(--color-green-500); }
	.btn-primary:hover { background: var(--color-green-700); border-color: var(--color-green-700); }

	.btn-secondary { background: var(--color-gray-200); color: var(--color-gray-900); border-color: var(--color-gray-300); }
	.btn-secondary:hover { background: var(--color-gray-300); }

	.btn-outline { background: transparent; color: var(--color-gray-900); border-color: var(--color-gray-300); }
	.btn-outline:hover { background: var(--color-gray-100); }

	.btn-danger { background: var(--color-error); color: var(--color-white); border-color: var(--color-error); }
	.btn-danger:hover { filter: brightness(0.9); }

	.btn-ghost { background: transparent; color: var(--color-gray-900); border-color: transparent; }
	.btn-ghost:hover { background: var(--color-gray-100); }

	button:disabled { opacity: 0.6; cursor: not-allowed; }

	@media (max-width: 900px) {
		.btn-md { padding: 0.5rem 0.9rem; }
		.btn-lg { padding: 0.75rem 1.25rem; }
	}
</style>

