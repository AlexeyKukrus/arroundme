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

	const handleChange = (e: Event):void => {
		const selectElement = e.currentTarget as HTMLSelectElement;
		const selectedValues = Array.from(selectElement.selectedOptions).map((option) => option.value);
		const value = multiple ? selectedValues : selectedValues[0] || '';
		dispatch('change', value);
	}
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

<style>
    .select-container {
        position: relative;
        display: inline-block;
        width: 100%;
    }

    select {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--color-gray-300);
        border-radius: 4px;
        background-color: var(--color-white);
        font-size: 16px;
        cursor: pointer;
        appearance: none;
        transition: border-color 0.3s;
    }

    select:focus {
        outline: none;
        border-color: var(--color-action-success);
        box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
    }

    select.multiple {
        min-height: 150px;
        padding: 5px;
    }

    option {
        padding: 8px 12px;
    }

    option:checked {
        background-color: var(--color-action-success);
        color: var(--color-white);
    }
</style>