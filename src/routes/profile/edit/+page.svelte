<script lang="ts">
  import { user } from '@app/models/users/store';
  import { goto } from '$app/navigation';

  let name: string = $user?.name ?? '';

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    user.updateName(trimmed);
    goto('/profile');
  };
</script>

<section class="edit-profile">
  <h1 class="title">Редактирование пользователя</h1>

  <form class="form" on:submit|preventDefault={onSubmit}>
    <label class="field">
      <span class="label">Имя</span>
      <input class="input" type="text" bind:value={name} placeholder="Введите имя" />
    </label>

    <div class="actions">
      <button class="primary" type="submit">Сохранить</button>
      <button class="secondary" type="button" on:click={() => goto('/profile')}>Отмена</button>
    </div>
  </form>

  <style>
    .edit-profile { max-width: 720px; margin: 2rem auto; padding: 0 1rem; }
    .title { margin-bottom: 1rem; }
    .form { border: 1px solid var(--color-border); border-radius: 8px; padding: 1rem; }
    .field { display: flex; flex-direction: column; gap: .5rem; margin-bottom: 1rem; }
    .label { color: var(--color-text); opacity: .8; }
    .input { padding: .5rem .75rem; border: 1px solid var(--color-border); border-radius: 6px; }
    .actions { display: flex; gap: .5rem; }
    .primary { background: var(--color-midnight); color: var(--color-white); padding: .5rem 1rem; border-radius: 6px; }
    .secondary { background: transparent; color: var(--color-text); padding: .5rem 1rem; border-radius: 6px; border: 1px solid var(--color-border); }
  </style>
</section>

