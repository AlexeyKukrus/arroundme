<script lang="ts">
	// ActionButton

	export let onCancel: () => void;
	export let onSubmit: () => void;
	export let submitLabel: string = 'Сохранить';
	export let cancelLabel: string = 'Отмена';
</script>

<div class="action-buttons">
	<button type="button" on:click={onCancel} class="cancel-btn">{cancelLabel}</button>
	<button type="submit" class="submit-btn" on:click={onSubmit}>
		{submitLabel}
	</button>
</div>

<style>
	.action-buttons {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
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
		border: 1px solid var(--color-gray-300);
		color: var(--color-gray-900);
	}

	.cancel-btn:hover {
		background: var(--color-gray-100);
	}

	.submit-btn {
		background: var(--color-green-500);
		color: var(--color-white);
		border: none;
	}

	.submit-btn:hover {
		background: var(--color-green-700);
	}

	@media (max-width: 900px) {
		button {
			padding: 0.5rem 0.9rem;
		}
	}
</style>
