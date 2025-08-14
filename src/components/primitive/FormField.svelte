<script lang="ts">
	// FormField

	export let label: string;
	export let type: 'text' | 'textarea' | 'datetime-local' = 'text';
	export let value: string;
	export let placeholder: string = '';
	export let required: boolean = false;
</script>

<div class="form-field">
	<label>
		<span class="label-text">{label}</span>
		{#if type === 'textarea'}
			<textarea bind:value {placeholder} {required} class="input" />
		{:else}
			<input {type} bind:value {placeholder} {required} class="input" />
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
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	.input:focus {
		outline: none;
		border-color: #42b983;
		box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
	}

	textarea.input {
		min-height: 100px;
		resize: vertical;
	}
</style>
