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

	$: classes = ['btn', `btn-${variant}`, `btn-${size}`, fullWidth ? 'btn-block' : '']
		.filter(Boolean)
		.join(' ');
</script>

<button class={classes} {type} {disabled} on:click={handleClick}>
	<slot>{label}</slot>
</button>
