<script lang="ts">
	// FormField
	import { createEventDispatcher, onDestroy } from 'svelte';

	export let label: string;
	export let type: 'text' | 'textarea' | 'datetime-local' = 'text';
	export let value: string = '';
	export let placeholder: string = '';
	export let required: boolean = false;
	export let delay: number = 0;
	export let disabled: boolean = false;

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
			<textarea class="input" {placeholder} {required} {value} {disabled} on:input={handleInput}
			></textarea>
		{:else}
			<input
				class="input"
				{type}
				{placeholder}
				{required}
				{value}
				{disabled}
				on:input={handleInput}
			/>
		{/if}
	</label>
</div>
