<script lang="ts">
	import { goto } from '$app/navigation';
	import { showAuthModal, isAuthenticated } from '$lib/stores/auth';

	let email = '';
	let password = '';
	let errorMessage = '';

	const handleSubmit = (e: Event) => {
		e.preventDefault();

		if (email === 'test@test.ru' && password === 'test') {
			isAuthenticated.set(true);
			showAuthModal.set(false); // Используем хранилище вместо локального состояния
			errorMessage = '';
			// Дополнительно можно сохранить токен
			localStorage.setItem('auth-token', 'dummy-token');
		} else {
			errorMessage = 'Неверный email или пароль';
		}
	};

	const closeModal = () => {
		showAuthModal.set(false);
	};
</script>

{#if $showAuthModal}
	<div class="modal-backdrop">
		<div class="blur-background"></div>
		<div class="modal">
			<div class="modal-container border">
				<h1 class="login-title">Авторизация</h1>
				{#if errorMessage}
					<div class="error-message">{errorMessage}</div>
				{/if}

				<button class="social-login-btn">
					<svg class="social-icon" viewBox="0 0 24 24" width="20" height="20">
						<path
							fill="#4285F4"
							d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 15.867 0 12.48 0 5.867 0 .853 5.867.853 12s5.014 12 11.627 12c8.013 0 11.307-6.373 11.307-11.987 0-1.067-.133-1.853-.267-2.653H12.48z"
						/>
					</svg>
					Войти при помощи Google
				</button>

				<div class="divider">
					<span class="divider-line"></span>
					<span class="divider-text">или</span>
					<span class="divider-line"></span>
				</div>

				<form class="login-form" on:submit|preventDefault={handleSubmit}>
					<div class="form-group">
						<label class="input-label">Электронная почта</label>
						<input
							type="email"
							class="form-input"
							placeholder="Введите эл.почту"
							bind:value={email}
							required
						/>
					</div>

					<div class="form-group">
						<div class="password-header">
							<label class="input-label">Пароль</label>
							<a href="#" class="forgot-link">Забыли пароль?</a>
						</div>
						<input
							type="password"
							class="form-input"
							placeholder="Введите пароль"
							bind:value={password}
							required
						/>
					</div>

					<button type="submit" class="login-btn"> Войти </button>
				</form>
			</div>
		</div>
	</div>
{/if}
