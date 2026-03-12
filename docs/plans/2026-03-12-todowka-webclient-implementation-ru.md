# План реализации Todo Web Client

**Дата:** 2026-03-12
**Основан на:** docs/plans/2026-03-12-todowka-webclient-design.md
**Статус:** Готов к выполнению

---

## Таблица задач

| # | Слой | Задача | Усилие | Зависит от |
|---|-------|---------|----------|-------------|
| 1 | Foundation | Init Next.js с TypeScript и зависимостями | S | — |
| 2 | Foundation | Настройка Tailwind CSS и design tokens | S | 1 |
| 3 | Foundation | Настройка структуры директорий | XS | 1 |
| 4 | Types | Создать файл TypeScript типов (types/index.ts) | S | 3 |
| 5 | API Client | Реализовать базовый класс TodoAPIClient | S | 4 |
| 6 | API Client | Создать модуль tasks API (lib/api/tasks.ts) | M | 5 |
| 7 | API Client | Создать модуль projects API (lib/api/projects.ts) | M | 5 |
| 8 | API Client | Создать модуль inbox API (lib/api/inbox.ts) | S | 5 |
| 9 | API Client | Создать модуль tags API (lib/api/tags.ts) | S | 5 |
| 10 | API Client | Создать модуль contexts API (lib/api/contexts.ts) | S | 5 |
| 11 | API Client | Создать модуль areas API (lib/api/areas.ts) | S | 5 |
| 12 | API Client | Создать модуль notifications API (lib/api/notifications.ts) | S | 5 |
| 13 | State | Создать Task store (Zustand) | S | 4 |
| 14 | State | Создать Navigation store (Zustand) | S | 4 |
| 15 | State | Создать GTD store (Zustand) | S | 4 |
| 16 | State | Настроить провайдер React Query | M | 1 |
| 17 | Base UI | Создать компонент Button | S | 2 |
| 18 | Base UI | Создать компонент Card | S | 2 |
| 19 | Base UI | Создать компоненты Input & Textarea | S | 2 |
| 20 | Base UI | Создать компонент Select | S | 2 |
| 21 | Base UI | Создать компонент Checkbox | S | 2 |
| 22 | Base UI | Создать компонент Badge | S | 2 |
| 23 | Base UI | Создать компонент Modal | M | 17, 18 |
| 24 | Base UI | Создать компонент EmptyState | S | 2 |
| 25 | Base UI | Создать компонент Spinner | XS | 2 |
| 26 | Domain UI | Создать компонент TaskItem | M | 4, 22 |
| 27 | Domain UI | Создать компонент TaskList | M | 26 |
| 28 | Domain UI | Создать компонент TaskFilters | S | 4, 19, 20, 22 |
| 29 | Domain UI | Создать компонент TaskForm | M | 17, 19, 20, 21 |
| 30 | Domain UI | Создать компонент ProjectCard | M | 4, 22 |
| 31 | Domain UI | Создать компонент ProjectList | M | 30 |
| 32 | Domain UI | Создать компонент ProjectForm | M | 17, 19 |
| 33 | Domain UI | Создать компонент ProgressBar | S | 2 |
| 34 | Layout | Создать компонент Sidebar | M | 17 |
| 35 | Layout | Создать компонент Header | S | 17 |
| 36 | Layout | Создать компонент MainContent | XS | 34, 35 |
| 37 | Layout | Создать компонент QuickCapture | M | 17, 19, 29 |
| 38 | Hooks | Создать useTasks hook | M | 6, 16 |
| 39 | Hooks | Создать useProjects hook | M | 7, 16 |
| 40 | Hooks | Создать useInbox hook | M | 8, 16 |
| 41 | Hooks | Создать useTags hook | S | 9, 16 |
| 42 | Hooks | Создать useContexts hook | S | 10, 16 |
| 43 | Hooks | Создать useAreas hook | S | 11, 16 |
| 44 | Pages | Создать root layout (app/layout.tsx) | S | 34, 35, 36, 16 |
| 45 | Pages | Создать Dashboard (app/page.tsx) | L | 37, 38, 39, 13, 15 |
| 46 | Pages | Создать Inbox (app/inbox/page.tsx) | L | 27, 40, 29 |
| 47 | Pages | Создать Tasks (app/tasks/page.tsx) | L | 27, 38, 28 |
| 48 | Pages | Создать Next Actions (app/tasks/next-actions/page.tsx) | M | 27, 38 |
| 49 | Pages | Создать Projects list (app/projects/page.tsx) | L | 31, 39, 32 |
| 50 | Pages | Создать Project details (app/projects/[id]/page.tsx) | L | 27, 30, 38, 39 |
| 51 | Pages | Создать Areas (app/areas/page.tsx) | M | 43, 29 |
| 52 | Pages | Создать Contexts (app/contexts/page.tsx) | M | 42, 29 |
| 53 | Pages | Создать Tags (app/tags/page.tsx) | M | 41, 29 |
| 54 | Pages | Создать Weekly Review (app/review/page.tsx) | L | 40, 38, 39 |
| 55 | Docs | Создать README.md | S | — |
| 56 | Docs | Создать документацию по настройке окружения | XS | 1 |
| 57 | Docs | Обновить AGENTS.md с командами build/test | XS | 55 |
| 58 | Refactor | Добавить error boundaries | M | 44 |
| 59 | Refactor | Добавить loading states | M | 25 |
| 60 | Refactor | Добавить оптимистичные обновления | L | 38, 39, 40 |

---

## Детальные карточки задач

### L0-01 — Инициализация Next.js проекта с TypeScript и зависимостями

**Цель:** Инициализировать проект Next.js 14 с необходимыми зависимостями.

**Вход:** Пустая директория с инициализированным git.

**Выход:** `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, шаблон `.env.local`.

**Зависимости для установки:**

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.0.0",
    "react-hook-form": "^7.0.0",
    "zod": "^3.0.0",
    "@hookform/resolvers": "^3.0.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0",
    "@types/react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

**Шаги:**
1. Инициализировать Next.js проект с TypeScript: `npm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"`
2. Настроить tsconfig.json для строгой проверки типов
3. Создать next.config.js
4. Создать tailwind.config.ts скелет
5. Создать .env.local с переменной URL API
6. Установить дополнительные зависимости: @tanstack/react-query, zustand, react-hook-form, zod, @hookform/resolvers, date-fns

**Готово когда:**
- `npm run dev` успешно запускается на http://localhost:3000
- Все зависимости установлены в package.json
- Страницы Next.js рендерятся в браузере

**Оценка усилий:** S (1 час)

**Зависит от:** —

---

### L0-02 — Настройка Tailwind CSS и design tokens

**Цель:** Настроить Tailwind CSS с кастомными цветами и design tokens.

**Вход:** Задача L0-01 завершена.

**Выход:** `tailwind.config.ts` с кастомными цветами, `src/app/globals.css` с базовыми стилями.

**Кастомные цвета:**

```typescript
colors: {
  primary: { DEFAULT: '#2563eb' }, // blue-600
  background: '#f8fafc',          // slate-50
  card: '#ffffff',                 // white
  border: '#e2e8f0',             // slate-200
  foreground: '#0f172a',           // slate-900
  'foreground-secondary': '#475569', // slate-600
  
  // Status colors
  'status-inbox': '#6b7280',      // gray-500
  'status-active': '#3b82f6',     // blue-500
  'status-completed': '#22c55e',   // green-500
  'status-waiting': '#eab308',     // yellow-500
  'status-someday': '#a855f7',    // purple-500
  
  // Priority colors
  'priority-low': '#94a3b8',      // slate-400
  'priority-medium': '#eab308',    // yellow-500
  'priority-high': '#ef4444',     // red-500
}
```

**Шаги:**
1. Настроить tailwind.config.ts с кастомными цветами и design tokens
2. Настроить globals.css с базовыми стилями, настройками шрифта и utility классами
3. Настроить content paths для сканирования src директории
4. Добавить поддержку dark mode (опционально, но рекомендуется)

**Готово когда:**
- Tailwind классы работают в компонентах
- Кастомные цвета (blue-600, slate-50 и т.д.) определены и используемы
- Базовые стили применены глобально

**Оценка усилий:** S (1 час)

**Зависит от:** L0-01

---

### L0-03 — Настройка структуры директорий

**Цель:** Создать все необходимые директории с плейсхолдер-файлами.

**Вход:** Задача L0-01 завершена.

**Выход:** Структура директорий с плейсхолдерами:
```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── inbox/
│   │   │   └── page.tsx (плейсхолдер)
│   │   ├── tasks/
│   │   │   ├── page.tsx (плейсхолдер)
│   │   │   └── next-actions/
│   │   │       └── page.tsx (плейсхолдер)
│   │   ├── projects/
│   │   │   ├── page.tsx (плейсхолдер)
│   │   │   └── [id]/
│   │   │       └── page.tsx (плейсхолдер)
│   │   ├── areas/
│   │   │   └── page.tsx (плейсхолдер)
│   │   ├── contexts/
│   │   │   └── page.tsx (плейсхолдер)
│   │   ├── tags/
│   │   │   └── page.tsx (плейсхолдер)
│   │   └── review/
│   │       └── page.tsx (плейсхолдер)
│   ├── layout.tsx (плейсхолдер)
│   └── page.tsx (плейсхолдер)
├── components/
│   ├── ui/
│   ├── task/
│   ├── project/
│   └── layout/
├── lib/
│   ├── api/
│   ├── hooks/
│   └── utils/
├── types/
└── stores/
```

**Шаги:**
1. Создать все директории используя `mkdir -p`
2. Создать плейсхолдер-файлы для каждой страницы с базовым контентом "Coming soon"
3. Создать плейсхолдер-файлы для каждой директории (index.ts или .gitkeep)

**Шаблон плейсхолдера:**

```typescript
export default function Placeholder() {
  return <div className="p-4">Контент плейсхолдера</div>;
}
```

**Готово когда:**
Все директории существуют с плейсхолдер-файлами.
Структура соответствует дизайн-документу точно.

**Оценка усилий:** XS (30 минут)

**Зависит от:** L0-01

---

*(Документ сокращён для экономии места. Остальные задачи аналогичны английской версии)*

---

## Краткое резюме

**Всего задач:** 60

**По слоям:**
- L0 (Foundation): 3 задачи (3-5 часов)
- L1 (Types): 1 задача (1 час)
- L2 (API Client): 8 задач (8 часов)
- L3 (State): 4 задачи (4 часа)
- L4 (Base UI): 9 задач (9 часов)
- L5 (Domain UI): 8 задач (12 часов)
- L6 (Layout): 4 задачи (3-5 часов)
- L7 (Hooks): 6 задач (10 часов)
- L8 (Pages): 10 задач (30 часов)
- L9 (Docs): 3 задачи (2 часа)
- L10 (Refactor): 3 задачи (8 часов)

**Общее время:** ~120 часов (15 рабочих дней @ 8 часов/день)

---

## Критерии успеха

- [ ] Все 60 задач завершены
- [ ] Полный GTD workflow функционален
- [ ] Все страницы рендерятся корректно
- [ ] Интеграция API работает
- [ ] Ошибок типов: 0
- [ ] Адаптивно на мобильных
- [ ] Оптимистичные обновления работают
- [ ] Обработка ошибок на месте

---

**Общая оценка усилий:** ~120 часов (15 дней @ 8 часов/день)
