<script lang="ts">
	// Select
	import { createEventDispatcher } from 'svelte';

	export let options: Array<{ value: string; label: string }> = [];
	export let selected: string[] = [];
	export let multiple: boolean = false;
	export let placeholder: string = 'Выберите...';

	const dispatch = createEventDispatcher<{
		change: string | string[];
	}>();

	const handleChange = (e: Event): void => {
		const selectElement = e.currentTarget as HTMLSelectElement;
		const selectedValues = Array.from(selectElement.selectedOptions).map((option) => option.value);
		const value = multiple ? selectedValues : selectedValues[0] || '';
		dispatch('change', value);
	};
</script>

<div class="select-container">
	<select {multiple} on:change={handleChange} class:multiple>
		{#if !multiple && !selected.length}
			<option value="" disabled selected>
				{placeholder}
			</option>
		{/if}

		{#each options as option (option.value)}
			<option
				value={option.value}
				selected={multiple ? selected.includes(option.value) : selected[0] === option.value}
			>
				{option.label}
			</option>
		{/each}
	</select>
</div>
