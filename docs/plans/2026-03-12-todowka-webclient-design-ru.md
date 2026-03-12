# Todo Web Client — Дизайн-документ

**Дата:** 2026-03-12
**Статус:** Утверждён
**Тип:** Дизайн приложения

---

## Обзор

Веб-приложение для личного управления задачами по методологии GTD (Getting Things Done) с полной интеграцией с Todo API.

**Ключевые требования:**
- Для личного использования
- Полная реализация GTD-рабочего процесса
- Минималистичный UI
- На базе Next.js + TypeScript + Tailwind CSS

---

## 1. Архитектура

### Технологический стек

| Слой | Технология | Назначение |
|-------|-----------|-------------|
| Фреймворк | Next.js 14 (App Router) | SSR/SSG, маршрутизация, API routes |
| Язык | TypeScript | Типобезопасность |
| Стилизация | Tailwind CSS | Utility-first CSS |
| State Management | Zustand | Клиентский state |
| Загрузка данных | TanStack Query | Серверный state, кеширование, оптимистичные обновления |
| Формы | React Hook Form + Zod | Обработка форм, валидация |
| Работа с датами | date-fns | Форматирование/манипуляция дат |

### Структура директорий

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Группа маршрутов
│   │   ├── inbox/          # Страница Inbox
│   │   ├── tasks/          # Страница списка задач
│   │   ├── next-actions/   # Страница Next Actions
│   │   ├── projects/       # Страница списка проектов
│   │   ├── projects/[id]/  # Страница деталей проекта
│   │   ├── areas/          # Страница областей
│   │   ├── contexts/       # Страница контекстов
│   │   ├── tags/           # Страница тегов
│   │   └── review/         # Еженедельный обзор
│   ├── layout.tsx          # Корневой layout
│   └── page.tsx            # Страница Dashboard
├── components/
│   ├── ui/                 # Базовые UI компоненты
│   ├── task/               # Компоненты задач
│   ├── project/            # Компоненты проектов
│   └── layout/             # Layout компоненты
├── lib/
│   ├── api/                # API client layer
│   ├── hooks/              # Кастомные React hooks
│   └── utils/              # Утилиты
├── types/                  # TypeScript типы
└── stores/                 # Zustand stores
```

---

## 2. Страницы и маршруты

### Dashboard (`/`)

- Быстрая форма захвата (только заголовок, создаёт в Inbox)
- Счётчики: Inbox, Active задачи, Next Actions
- Список 5 Next Actions
- Активные проекты с индикаторами прогресса

### Inbox (`/inbox`)

- Список задач со статусом `inbox`
- Быстрые действия: Clarify (редактировать), Delete
- Кнопка "Process All" для обработки всех inbox-задач

### Tasks (`/tasks`)

- Табы по статусу: Inbox, Active, Waiting, Someday, Completed
- Фильтры: приоритет, контекст, тег, проект
- Сортировка: по дате, приоритету
- Действия: Complete, Next Action, Edit, Delete

### Next Actions (`/tasks/next-actions`)

- Список задач с `is_next_action: true`
- Кнопка завершения для каждой задачи

### Projects (`/projects`)

- Пагинированный список проектов
- Индикатор прогресса для каждого проекта
- Действия: Create/Edit/Delete

### Project Details (`/projects/[id]`)

- Информация о проекте и прогресс
- Список задач в проекте
- Список подзадач
- Добавить задачу в проект

### Areas (`/areas`)

- Список областей ответственности
- Проекты по областям
- Действия: Create/Edit/Delete

### Contexts (`/contexts`)

- Список контекстов
- Задачи по контекстам
- Действия: Create/Edit/Delete

### Tags (`/tags`)

- Список тегов с цветами
- Задачи по тегам
- Действия: Create/Edit/Delete

### Weekly Review (`/review`)

- Пошаговый направленный обзор
1. Inbox Review: Обработать все inbox-элементы
2. Projects Review: Обновить статус проектов
3. Next Actions: Выбрать задачи на следующую неделю
4. Someday Review: Обзор задач без дедлайна

---

## 3. API Client Layer

### TodoAPIClient Class

```typescript
class TodoAPIClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(baseURL: string = 'http://localhost:8000/api/v1');

  async request<T>(endpoint: string, options?: RequestInit): Promise<T>;
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data: any): Promise<T>;
  put<T>(endpoint: string, data: any): Promise<T>;
  delete(endpoint: string): Promise<void>;
}

class APIError extends Error {
  constructor(message: string, public status: number);
}
```

### API Modules

**Tasks API** (`lib/api/tasks.ts`)
```typescript
export const tasksAPI = {
  getAll(params?: TaskFilters): Promise<Task[]>
  getById(id: number): Promise<Task>
  create(data: TaskCreate): Promise<Task>
  update(id: number, data: TaskUpdate): Promise<Task>
  delete(id: number): Promise<void>
  complete(id: number): Promise<Task>
  setNextAction(id: number): Promise<Task>
  toggleComplete(id: number): Promise<Task>
}
```

**Projects API** (`lib/api/projects.ts`)
```typescript
export const projectsAPI = {
  getAll(page: number, limit: number): Promise<PaginatedResponse<Project>>
  getById(id: number): Promise<Project>
  create(data: ProjectCreate): Promise<Project>
  update(id: number, data: ProjectUpdate): Promise<Project>
  delete(id: number): Promise<void>
  complete(id: number): Promise<Project>
}
```

**Inbox API** (`lib/api/inbox.ts`)
```typescript
export const inboxAPI = {
  getAll(): Promise<Task[]>
  create(data: InboxCreate): Promise<Task>
}
```

**Supporting Entities** (`lib/api/`)
- `tags.ts` - Tag CRUD
- `contexts.ts` - Context CRUD
- `areas.ts` - Area CRUD
- `notifications.ts` - Notifications CRUD

### React Query Hooks

**Tasks Hooks** (`lib/hooks/useTasks.ts`)
```typescript
export function useTasks(filters?: TaskFilters)
export function useTask(id: number)
export function useNextActions()
export function useCreateTask()
export function useUpdateTask()
export function useDeleteTask()
export function useCompleteTask()
export function useSetNextAction()
```

**Projects Hooks** (`lib/hooks/useProjects.ts`)
```typescript
export function useProjects(page: number, limit: number)
export function useProject(id: number)
export function useCreateProject()
export function useUpdateProject()
export function useDeleteProject()
export function useCompleteProject()
```

**Similar hooks for** tags, contexts, areas, inbox.

---

## 4. Управление состоянием

### Zustand Stores

**Task Store** (`stores/useTaskStore.ts`)
```typescript
interface TaskStore {
  // State
  selectedTask: Task | null;
  filters: TaskFilters;
  viewMode: 'list' | 'card';

  // Actions
  selectTask: (task: Task | null) => void;
  setFilters: (filters: TaskFilters) => void;
  setViewMode: (mode: 'list' | 'card') => void;
  clearFilters: () => void;
}
```

**Navigation Store** (`stores/useNavigationStore.ts`)
```typescript
interface NavigationStore {
  currentPage: string;
  sidebarOpen: boolean;
  setCurrentPage: (page: string) => void;
  toggleSidebar: () => void;
}
```

**GTD Store** (`stores/useGTDStore.ts`)
```typescript
interface GTDStore {
  inboxCount: number;
  nextActionsCount: number;
  reviewMode: boolean;
  setReviewMode: (enabled: boolean) => void;
}
```

### Поток состояния

```
User Action → Form (RHF) → API Call → React Query → Zustand (optional) → UI
                      ↓
                  Error Handling
```

- **Server state:** React Query (tasks, projects, tags, contexts, areas)
- **UI state:** Zustand (фильтры, выбор, навигация)
- **Form state:** React Hook Form (создание, редактирование)

---

## 5. Реализация GTD Workflow

### 1. Capture (Захват)

**Возможности:**
- Быстрый захват на Dashboard (только заголовок)
- Floating `+` кнопка на всех страницах
- Создаёт задачу в Inbox со статусом `inbox`

**API:**
```http
POST /api/v1/inbox
{ "title": "...", "description": "..." }
```

---

### 2. Clarify (Уточнение)

**Inbox Processing:**
- Просмотр деталей задачи
- Выбор действия:
  - **Make Task:** Редактировать с проектом, контекстом, тегами, приоритетом
  - **Delete:** Удалить задачу
  - **Someday:** Переместить в статус `someday`

**API:**
```http
PUT /api/v1/tasks/{id}
{
  "status": "active",
  "project_id": 1,
  "context_id": 1,
  "tag_ids": [1, 2],
  "priority": "high"
}
```

---

### 3. Organize (Организация)

**Создание задач:**
- Выбрать проект
- Выбрать контекст (где)
- Выбрать теги (какая категория)
- Установить приоритет (когда)

**Просмотр:**
- По проектам (`/projects`) - видеть все задачи по проекту
- По контекстам (`/contexts`) - видеть задачи по локации/ситуации
- По тегам (`/tags`) - видеть задачи по категории
- По областям (`/areas`) - видеть высокоуровневые области

**API:**
```http
POST /api/v1/tasks
PUT /api/v1/tasks/{id}
GET /api/v1/tasks?status=active&context_id=1
```

---

### 4. Engage (Выполнение)

**Next Actions (`/tasks/next-actions`):**
- Список задач с `is_next_action: true`
- Кнопка завершения
- Переключение статуса

**API:**
```http
GET /api/v1/tasks/next-actions
POST /api/v1/tasks/{id}/next-action
POST /api/v1/tasks/{id}/complete
POST /api/v1/tasks/{id}/toggle-complete
```

---

### 5. Review (Обзор)

**Weekly Review (`/review`):**

1. **Inbox Review:**
   - Показать все inbox-элементы
   - Обработать каждый

2. **Projects Review:**
   - Показать все проекты
   - Обновить статус проекта
   - Обзор прогресса

3. **Next Actions Selection:**
   - Показать активные задачи
   - Выбрать задачи на следующую неделю (set `is_next_action`)

4. **Someday Review:**
   - Показать задачи со статусом `someday`
   - Решить, какие должны стать активными

**API:**
```http
GET /api/v1/inbox
GET /api/v1/projects
GET /api/v1/tasks?status=someday
POST /api/v1/tasks/{id}/next-action
```

---

## 6. UI Компоненты

### Базовые компоненты (`components/ui/`)

| Компонент | Варианты пропов |
|-----------|---------------|
| `Button` | primary, secondary, ghost, destructive |
| `Card` | - |
| `Input` | text, search |
| `Textarea` | - |
| `Select` | - |
| `Checkbox` | - |
| `Badge` | status (inbox, active, completed, waiting, someday), priority (low, medium, high) |
| `Modal` | - |
| `EmptyState` | - |
| `Spinner` | - |

### Task компоненты (`components/task/`)

| Компонент | Описание |
|-----------|-------------|
| `TaskList` | Контейнер списка с пагинацией |
| `TaskItem` | Одна задача с действиями |
| `TaskForm` | Форма создания/редактирования |
| `TaskFilters` | Контролы фильтрации |
| `TaskActions` | Dropdown кнопок действий |

### Project компоненты (`components/project/`)

| Компонент | Описание |
|-----------|-------------|
| `ProjectList` | Контейнер списка |
| `ProjectCard` | Карточка с прогрессом |
| `ProjectForm` | Форма создания/редактирования |
| `ProgressBar` | Визуальный прогресс-бар |

### Layout компоненты (`components/layout/`)

| Компонент | Описание |
|-----------|-------------|
| `Sidebar` | Навигационный сайдбар |
| `Header` | Верхний хедер с заголовком страницы |
| `MainContent` | Обёртка основного контента |
| `QuickCapture` | Форма быстрого создания задач |

### Иерархия страниц

```
Layout
├── Sidebar
│   ├── NavItem: Inbox
│   ├── NavItem: Tasks
│   ├── NavItem: Projects
│   ├── NavItem: Areas
│   ├── NavItem: Contexts
│   ├── NavItem: Tags
│   └── NavItem: Review
└── MainContent
    ├── Header
    │   ├── PageTitle
    │   └── QuickCapture (только на Dashboard)
    └── PageContent
        ├── TaskList (Tasks page)
        ├── ProjectList (Projects page)
        ├── ReviewPanel (Review page)
        └── ...
```

---

## 7. Design System

### Цвета (Tailwind)

| Назначение | Цвет |
|---------|-------|
| Primary | `blue-600` |
| Background | `slate-50` |
| Card | `white` |
| Border | `slate-200` |
| Text Primary | `slate-900` |
| Text Secondary | `slate-600` |
| Success | `green-600` |
| Warning | `yellow-600` |
| Error | `red-600` |

### Цвета статусов

| Статус | Цвет |
|--------|-------|
| Inbox | `gray-500` |
| Active | `blue-500` |
| Completed | `green-500` |
| Waiting | `yellow-500` |
| Someday | `purple-500` |

### Цвета приоритетов

| Приоритет | Цвет |
|----------|-------|
| Low | `slate-400` |
| Medium | `yellow-500` |
| High | `red-500` |

### Типографика

- Font: Системные шрифты (San Francisco, Inter, Segoe UI)
- Размеры: text-sm, text-base, text-lg, text-xl

### Отступы

- Более компактные отступы для списков (compact mode)
- Стандартные отступы для карточек

---

## 8. Roadmap реализации

### Phase 1: Foundation
- Настройка Next.js проекта с TypeScript
- Настройка Tailwind CSS
- Создание структуры директорий
- Создание базовых UI компонентов

### Phase 2: API Layer
- Реализация TodoAPIClient
- Создание API модулей (tasks, projects, tags, contexts, areas, inbox)
- Настройка React Query

### Phase 3: Core Pages
- Dashboard с быстрым захватом
- Список задач с фильтрами
- Обработка Inbox

### Phase 4: GTD Workflow
- Страница Next Actions
- Страница проектов
- Страница Weekly Review

### Phase 5: Organization
- Страница областей
- Страница контекстов
- Страница тегов

### Phase 6: Polish
- Обработка ошибок
- Loading состояния
- Оптимистичные обновления
- Адаптивный дизайн

---

## 9. TypeScript типы

### Основные типы

```typescript
type TaskStatus = 'inbox' | 'active' | 'completed' | 'waiting' | 'someday';
type TaskPriority = 'low' | 'medium' | 'high';
type ProjectStatus = 'active' | 'completed';
type NotificationStatus = 'pending' | 'sent' | 'failed';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  project_id?: number;
  context_id?: number;
  tag_ids: number[];
  is_next_action: boolean;
  completed_at?: string;
  reminder_at?: string;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: number;
  name: string;
  description?: string;
  area_id?: number;
  status: ProjectStatus;
  progress: number;
  total_tasks: number;
  completed_tasks: number;
  created_at: string;
  updated_at: string;
}

interface Tag {
  id: number;
  name: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

interface Context {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface Area {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
```

---

## 10. Критерии успеха

- Полный GTD workflow реализован (Capture, Clarify, Organize, Engage, Review)
- Все API endpoints интегрированы
- Минималистичный, чистый UI
- Типобезопасность с TypeScript
- Оптимистичные обновления для лучшего UX
- Адаптивный дизайн
- Обработка ошибок везде

---

## Ссылки

- Todo API Documentation: `/docs/api todowka/`
- OpenAPI Spec: `/docs/api todowka/openapi.json`
- Integration Guide: `/docs/api todowka/INTEGRATION_GUIDE.md`
- Schema Documentation: `/docs/api todowka/SCHEMA_DOCUMENTATION.md`
