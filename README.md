# 🗺️ ArroundMe - Платформа событий

Веб-приложение для поиска и создания событий с интеграцией Яндекс.Карт.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка API ключей

Отредактируйте файл `src/lib/config/environment.ts` и замените fallback значения на ваши реальные API ключи:

```typescript
export const config = {
	yandexMapsApiKey: 'ваш_реальный_api_ключ_яндекс_карт',
	apiBaseUrl: 'https://aroundme.space/api/v1',
	geocodeBaseUrl: 'https://geocode-maps.yandex.ru/v1'
	// ... остальные настройки
};
```

### 3. Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:5173](http://localhost:5173)

## 🛠️ Технологии

- **Frontend**: Svelte 5 + SvelteKit
- **Стили**: CSS с CSS переменными
- **Карты**: Яндекс.Карты API
- **Тестирование**: Vitest + Playwright
- **Линтинг**: ESLint + Prettier

## 📁 Структура проекта

```
src/
├── components/          # UI компоненты
│   ├── primitive/      # Базовые компоненты
│   └── ui/            # Специализированные компоненты
├── lib/                # Утилиты и конфигурация
│   └── config/        # Конфигурация (API ключи, URL'ы)
├── routes/             # Маршруты SvelteKit
├── helpers/            # Вспомогательные функции
└── styles/             # Глобальные стили
```

## 🔧 Доступные команды

```bash
npm run dev          # Запуск dev сервера
npm run build        # Сборка для продакшна
npm run preview      # Предпросмотр сборки
npm run check        # Проверка типов
npm run lint         # Линтинг кода
npm run format       # Форматирование кода
npm run test         # Запуск тестов
```

## 🤝 Разработка

### Требования

- Node.js 18+
- npm 9+

### Рекомендации

1. Используйте TypeScript для всех новых файлов
2. Следуйте принципам SvelteKit
3. Пишите тесты для критической логики
4. Используйте ESLint и Prettier

## 🔒 Безопасность

- API ключи хранятся в `src/lib/config/environment.ts`
- Файл конфигурации исключен из git (см. .gitignore)
- Fallback значения только для разработки
- Для продакшна замените на реальные ключи

## 📄 Лицензия

MIT
