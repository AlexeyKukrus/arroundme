<!-- src/lib/components/FormField.svelte -->
<script lang="ts">
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
      <textarea
        bind:value
        {placeholder}
        {required}
        class="input"
      />
    {:else}
      <input
        {type}
        bind:value
        {placeholder}
        {required}
        class="input"
      />
    {/if}
  </label>
  {#if value && required}
    <span class="checkmark">✅</span>
  {/if}
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

  textarea.input {
    min-height: 100px;
    resize: vertical;
  }

  .checkmark {
    position: absolute;
    right: 10px;
    top: 40px;
    color: #4CAF50;
  }
</style>