# 🗺️ ArroundMe - Платформа событий

Веб-приложение для поиска и создания событий с интеграцией Яндекс.Карт.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка API ключей

Запросите конфигурационный файл и положите его в корень проекта

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

- Файл конфигурации исключен из git (см. .gitignore)
- Fallback значения только для разработки

## 📄 Лицензия

MIT

## 🧱 Модульная архитектура

### Зачем она нужна

Модульная архитектура разделяет приложение на независимые функциональные модули (features) и чётко разводит бизнес‑логику страниц и презентационные компоненты. Это упрощает сопровождение, переиспользование и тестирование.

### Базовые принципы

- **Страницы (routes) владеют логикой**: загрузка данных, состояния, сайд‑эффекты, навигация, модалки, доступ к браузерному API/SSR.
- **Модульные компоненты — презентационные**: получают данные через пропсы, отдают действия наружу через события. Не делают сетевые запросы, не ходят в `window/document`, не управляют глобальным состоянием.
- **Единые контракты API**: один стиль интерфейсов ответов, единая обработка ошибок/уведомлений.
- **Общие утилиты/типизация**: всё дублируемое — в `helpers`, модели — в `models` При этом helpers, stores, types модуля должны находиться внутри самого модуля.
- **SSR‑безопасность**: любой доступ к DOM/`window` только под флагом `browser` или внутри `onMount`.

### Структура каталогов

```
src/
├─ modules/                # Фичи (модули)
│  └─ events/
│     ├─ components/       # Презентационные элементы (карточки, карты, формы)
│     │  ├─ EventCard.svelte
│     │  ├─ EventForm.svelte
│     │  └─ EventsMap.svelte
│     ├─ EventsList/	   #Модуль
│     │  └─ EventsList.svelte
│     ├─ EventsView/
│     │  └─ EventsView.svelte
│     └─ index.ts          # Баррель экспорта
│
├─ routes/                 # Страницы SvelteKit (владельцы логики)
│  ├─ events/+page.svelte
│  └─ event/
│     ├─ create/+page.svelte
│     ├─ [id]/edit/+page.svelte
│     └─ [id]/view/+page.svelte
│
├─ models/                 # Доменные типы/сторы
│  └─ events/types.ts
│
├─ helpers/                # Общие функции/утилиты
│  ├─ fetch/               # Клиентский fetch и обработка ответов
│  └─ helpers.ts           # parseCoordinates, isInBounds, форматтеры и пр.
│
├─ shared/                 # Общие UI и модалки
│  ├─ ui/                  # Button, Title, FormField, Select, Header, Notifications
│  └─ modals/              # ConfirmationModal, MapModal, др.
└─ routes/api/             # Клиентские методы API (единый контракт)
```

### Границы ответственности

#### Страницы (`src/routes/.../+page.svelte`)

- Загружают данные через `routes/api/.../methods.ts`.
- Держат состояние загрузки/ошибок/фильтров/адаптивности.
- Выполняют сайд‑эффекты: `onMount`, `goto`, уведомления.
- Управляют модалками (`MapModal`, `ConfirmationModal`).
- Прокидывают данные и обработчики в модульные компоненты пропсами/событиями.

Пример (упрощённо):

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { getEventsListMethod } from '@api/events/methods';
  import { EventsList } from '@modules/events';
  let items = []; let loading = false; let error: string | null = null;
  onMount(async () => { try { loading = true; items = (await getEventsListMethod()).events; } catch { error = 'Ошибка'; } finally { loading = false; } });
</script>

<EventsList {items} {loading} hasBounds={true} isMobile={false} />
```

#### Модульные компоненты (`src/modules/...`)

- Принимают все необходимые данные через пропсы.
- Выбрасывают события наверх (`createEventDispatcher`).
- Не знают о сетевых запросах/навигации/модалках.

Пример событийного API:

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let items = [];
  const dispatch = createEventDispatcher<{ select: { id: string } }>();
  const select = (id: string) => dispatch('select', { id });
</script>
```

### Контракты API (routes/api)

- Все методы возвращают унифицированный ответ:

```ts
export interface ApiResponse<T = any> {
  success: boolean; data?: T; error?: string; message?: string;
}
```

- Списки: `{ success, events: Event[] }`. Создание/обновление: `{ success, data: Event }`. Удаление: `{ success }`.
- Ошибки проходят через `notifications.error(...)`, успех — `notifications.success(...)`.
- Для разработки без сервера допускается временный in‑memory мок внутри `routes/api/.../methods.ts` (одна точка входа, без утечки в компоненты). В проде — реальный `fetchFromClient` + `processApiResponse`.

Рекомендованный подход к мокам:

1. Инкапсулировать mock‑хранилище (массивы) в файле методов API.
2. Сохранять тот же контракт (типы/поля) как у реального API.
3. Не импортировать моки в компоненты — только страницы вызывают API.

### SSR‑безопасность

- Проверка среды: `import { browser } from '$app/environment'`.
- Любой доступ к `window/document` — только при `browser === true` и/или в `onMount`.
- Слушатели событий/скрипты (например, Яндекс.Карты) — добавлять/удалять корректно, чистить в `onDestroy`.
- Пример (`ConfirmationModal`):

```ts
$: if (browser && isOpen) { document.body.style.overflow = 'hidden'; }
```

### Именование и стиль

- Файлы компонентов: `PascalCase.svelte`. Папки фич — `camelCase`.
- Пропсы: семантичные, булевы — с префиксами `is/has/can`.
- Типы: все публичные пропсы/внешние API — c явными типами (`lang="ts"`).
- Перед коммитом выполнять форматирование кода с помощью prettier

### Поток данных (пропсы/события)

1. Страница получает/готовит данные.
2. Передаёт в модульные компоненты через пропсы (`items`, `loading`, `hasBounds`, и т. п.).
3. Модульные компоненты поднимают действия наверх через события — страница делает API‑вызовы, навигацию, модалки.

### Чеклист перед коммитом

- [ ] Логика загрузки/состояния — только в страницах `routes`.
- [ ] Компоненты в `modules` — без прямых сетевых запросов и `goto`.
- [ ] Дублируемые функции вынесены в `helpers`.
- [ ] API методы используют единый контракт `ApiResponse` и уведомления.
- [ ] SSR‑безопасность: доступ к DOM/`window` только при `browser`/`onMount`.
- [ ] Пропсы/события имеют понятные имена и явные типы.
