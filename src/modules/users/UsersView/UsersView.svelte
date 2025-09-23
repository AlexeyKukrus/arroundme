<script lang="ts">
	import { Button } from '@shared/ui';
	interface UserViewModel {
		id: string;
		name: string;
		createdAt: string;
	}
	export let user!: UserViewModel;
	export let formatDate: (iso: string) => string = (iso) => new Date(iso).toLocaleString();
</script>

<div class="card">
	<div class="row"><span class="label">ID:</span><span class="value">{user.id}</span></div>
	<div class="row"><span class="label">Имя:</span><span class="value">{user.name}</span></div>
	<div class="row">
		<span class="label">Создан:</span><span class="value">{formatDate(user.createdAt)}</span>
	</div>
</div>
<div class="actions">
	<Button variant="primary"><slot name="edit">Редактировать</slot></Button>
</div>
