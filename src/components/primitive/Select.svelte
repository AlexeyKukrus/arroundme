<script>
	import { createEventDispatcher } from 'svelte';

	export let options = [];
	export let selected = [];
	export let multiple = false;
	export let placeholder = 'Выберите...';

	const dispatch = createEventDispatcher()

	function handleChange(e) {
		const selectElement = e.currentTarget;
		const selectedValues = Array.from(selectElement.selectedOptions).map((option) => option.value);
		const value = multiple ? selectedValues : selectedValues[0] || null;
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
		border: 1px solid #ddd;
		border-radius: 4px;
		background-color: white;
		font-size: 16px;
		cursor: pointer;
		appearance: none;
		transition: border-color 0.3s;
	}

	select:focus {
		outline: none;
		border-color: #42b983;
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
		background-color: #42b983;
		color: white;
	}
</style>
