<script lang="ts">
	// ActionButton

	export let onCancel: () => void;
	export let onSubmit: () => void;
	export let submitLabel: string = 'Сохранить';
</script>

<div class="action-buttons">
	<button type="button" on:click={onCancel} class="cancel-btn"> Отмена </button>
	<button type="submit" class="submit-btn" on:click={onSubmit}>
		{submitLabel}
	</button>
</div>

<style>
	.action-buttons {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 2rem;
	}

	button {
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.cancel-btn {
		background: none;
		border: 1px solid #ddd;
		color: #333;
	}

	.cancel-btn:hover {
		background: #f5f5f5;
	}

	.submit-btn {
		background: #4caf50;
		color: white;
		border: none;
	}

	.submit-btn:hover {
		background: #3e8e41;
	}
</style>
