<script lang="ts">
  import { user } from '../../lib/stores/user';
  import { goto } from '$app/navigation';

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  $: current = $user;

  const toEdit = () => goto('/profile/edit');
</script>

<section class="profile">
  {#if current}
    <h1 class="title">Профиль пользователя</h1>
    <div class="card">
      <div class="row"><span class="label">ID:</span><span class="value">{current.id}</span></div>
      <div class="row"><span class="label">Имя:</span><span class="value">{current.name}</span></div>
      <div class="row"><span class="label">Создан:</span><span class="value">{formatDate(current.createdAt)}</span></div>
    </div>
    <div class="actions">
      <button class="primary" on:click={toEdit}>Редактировать</button>
    </div>
  {:else}
    <p>Пользователь не найден.</p>
  {/if}
  <style>
    .profile { max-width: 720px; margin: 2rem auto; padding: 0 1rem; }
    .title { margin-bottom: 1rem; }
    .card { border: 1px solid var(--color-border); border-radius: 8px; padding: 1rem; }
    .row { display: flex; gap: .5rem; padding: .5rem 0; }
    .label { width: 120px; color: var(--color-text); opacity: .7; }
    .value { flex: 1; }
    .actions { margin-top: 1rem; }
    .primary { background: var(--color-midnight); color: var(--color-white); padding: .5rem 1rem; border-radius: 6px; }
  </style>
</section>

