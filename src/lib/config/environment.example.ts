// Пример файла конфигурации
// Скопируйте этот файл в environment.ts и замените значения на реальные

export const config = {
	// API ключи - ЗАМЕНИТЕ НА РЕАЛЬНЫЕ ДЛЯ ПРОДАКШНА
	yandexMapsApiKey: 'ваш_реальный_api_ключ_яндекс_карт',

	// Базовые URL'ы
	apiBaseUrl: 'https://aroundme.space/api/v1',
	geocodeBaseUrl: 'https://geocode-maps.yandex.ru/v1',

	// Окружение
	environment: 'development',

	// Проверка на продакшн
	isProduction: false,
	isDevelopment: true
};

// Валидация обязательных переменных
export const validateConfig = () => {
	const requiredVars = ['yandexMapsApiKey'];
	const missingVars = requiredVars.filter((varName) => !config[varName as keyof typeof config]);

	if (missingVars.length > 0) {
		console.warn(`⚠️ Отсутствуют обязательные переменные: ${missingVars.join(', ')}`);
		console.warn('Для продакшна замените fallback значения на реальные API ключи.');
	}

	return missingVars.length === 0;
};
