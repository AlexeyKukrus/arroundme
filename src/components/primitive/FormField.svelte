<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';

	export let label: string;
	export let type: 'text' | 'textarea' | 'datetime-local' = 'text';
	export let value: string = '';
	export let placeholder: string = '';
	export let required: boolean = false;
	export let delay: number = 0; // задержка в мс (0 = без задержки)

	const dispatch = createEventDispatcher();

	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	const handleInput = (e: Event) => {
		const target = e.target as HTMLInputElement | HTMLTextAreaElement;
		const newValue = target.value;

		if (delay > 0) {
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				dispatch('onChange', newValue);
				timeoutId = null;
			}, delay);
		} else {
			dispatch('onChange', newValue);
		}
	};

	onDestroy(() => {
		if (timeoutId) clearTimeout(timeoutId);
	});
</script>

<div class="form-field">
	<label>
		<span class="label-text">{label}</span>
		{#if type === 'textarea'}
			<textarea class="input" {placeholder} {required} {value} on:input={handleInput} />
		{:else}
			<input class="input" {type} {placeholder} {required} {value} on:input={handleInput} />
		{/if}
	</label>
</div>

<style>
	.form-field {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.label-text {
		font-weight: 500;
		display: block;
		margin-bottom: 0.5rem;
	}

	.input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--color-gray-300);
		border-radius: 4px;
		font-size: 1rem;
	}

	.input:focus {
		outline: none;
		border-color: var(--color-action-success);
		box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
	}

	textarea.input {
		min-height: 100px;
		resize: vertical;
	}
</style>
