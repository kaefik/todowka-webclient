# Todo Web Client Design Document

**Date:** 2026-03-12
**Status:** Approved
**Type:** Application Design

---

## Overview

Web application for personal task management using GTD (Getting Things Done) methodology with full integration to the Todo API.

**Key Requirements:**
- Personal use
- Full GTD workflow implementation
- Minimalist UI
- Built with Next.js + TypeScript + Tailwind CSS

---

## 1. Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 (App Router) | SSR/SSG, routing, API routes |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first CSS |
| State Management | Zustand | Client-side state |
| Data Fetching | TanStack Query | Server state, caching, optimistic updates |
| Forms | React Hook Form + Zod | Form handling, validation |
| Date Handling | date-fns | Date formatting/manipulation |

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Dashboard route group
│   │   ├── inbox/          # Inbox page
│   │   ├── tasks/          # Tasks list page
│   │   ├── next-actions/   # Next Actions page
│   │   ├── projects/       # Projects list page
│   │   ├── projects/[id]/  # Project details page
│   │   ├── areas/          # Areas page
│   │   ├── contexts/       # Contexts page
│   │   ├── tags/           # Tags page
│   │   └── review/         # Weekly review page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Dashboard page
├── components/
│   ├── ui/                 # Base UI components
│   ├── task/               # Task-related components
│   ├── project/            # Project-related components
│   └── layout/             # Layout components
├── lib/
│   ├── api/                # API client layer
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
├── types/                  # TypeScript types
└── stores/                 # Zustand stores
```

---

## 2. Pages and Routes

### Dashboard (`/`)

- Quick capture form (title only, creates in Inbox)
- Counters: Inbox, Active tasks, Next Actions
- List of 5 Next Actions
- Active projects with progress bars

### Inbox (`/inbox`)

- List of tasks with status `inbox`
- Quick actions: Clarify (edit), Delete
- "Process All" button to handle all inbox tasks

### Tasks (`/tasks`)

- Tabs by status: Inbox, Active, Waiting, Someday, Completed
- Filters: priority, context, tag, project
- Sort: by date, priority
- Actions: Complete, Next Action, Edit, Delete

### Next Actions (`/tasks/next-actions`)

- List of tasks with `is_next_action: true`
- Complete button for each task

### Projects (`/projects`)

- Paginated list of projects
- Progress bar for each project
- Create/Edit/Delete actions

### Project Details (`/projects/[id]`)

- Project info and progress
- List of tasks in project
- Subtasks list
- Add task to project

### Areas (`/areas`)

- List of areas of responsibility
- Projects per area
- Create/Edit/Delete actions

### Contexts (`/contexts`)

- List of contexts
- Tasks per context
- Create/Edit/Delete actions

### Tags (`/tags`)

- List of tags with colors
- Tasks per tag
- Create/Edit/Delete actions

### Weekly Review (`/review`)

- Step-by-step guided review
1. Inbox Review: Process all inbox items
2. Projects Review: Update project status
3. Next Actions: Select tasks for next week
4. Someday Review: Review tasks without deadline

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

## 4. State Management

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

### State Flow

```
User Action → Form (RHF) → API Call → React Query → Zustand (optional) → UI
                      ↓
                  Error Handling
```

- **Server state:** React Query (tasks, projects, tags, contexts, areas)
- **UI state:** Zustand (filters, selection, navigation)
- **Form state:** React Hook Form (creation, editing)

---

## 5. GTD Workflow Implementation

### 1. Capture (Захват)

**Features:**
- Quick capture on Dashboard (title only)
- Floating `+` button on all pages
- Creates task in Inbox with status `inbox`

**API:**
```http
POST /api/v1/inbox
{ "title": "...", "description": "..." }
```

---

### 2. Clarify (Уточнение)

**Inbox Processing:**
- View task details
- Choose action:
  - **Make Task:** Edit with project, context, tags, priority
  - **Delete:** Remove task
  - **Someday:** Move to `someday` status

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

**Creating Tasks:**
- Select project
- Select context (where)
- Select tags (what category)
- Set priority (when)

**Viewing:**
- By Projects (`/projects`) - see all tasks per project
- By Contexts (`/contexts`) - see tasks by location/situation
- By Tags (`/tags`) - see tasks by category
- By Areas (`/areas`) - see high-level areas

**API:**
```http
POST /api/v1/tasks
PUT /api/v1/tasks/{id}
GET /api/v1/tasks?status=active&context_id=1
```

---

### 4. Engage (Выполнение)

**Next Actions (`/tasks/next-actions`):**
- List of tasks with `is_next_action: true`
- Complete button
- Toggle status

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
   - Show all inbox items
   - Process each one

2. **Projects Review:**
   - Show all projects
   - Update project status
   - Review progress

3. **Next Actions Selection:**
   - Show active tasks
   - Select tasks for next week (set `is_next_action`)

4. **Someday Review:**
   - Show tasks with status `someday`
   - Decide if any should become active

**API:**
```http
GET /api/v1/inbox
GET /api/v1/projects
GET /api/v1/tasks?status=someday
POST /api/v1/tasks/{id}/next-action
```

---

## 6. UI Components

### Base Components (`components/ui/`)

| Component | Props variants |
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

### Task Components (`components/task/`)

| Component | Description |
|-----------|-------------|
| `TaskList` | List container with pagination |
| `TaskItem` | Single task with actions |
| `TaskForm` | Create/Edit form |
| `TaskFilters` | Filter controls |
| `TaskActions` | Action buttons dropdown |

### Project Components (`components/project/`)

| Component | Description |
|-----------|-------------|
| `ProjectList` | List container |
| `ProjectCard` | Card with progress |
| `ProjectForm` | Create/Edit form |
| `ProgressBar` | Visual progress bar |

### Layout Components (`components/layout/`)

| Component | Description |
|-----------|-------------|
| `Sidebar` | Navigation sidebar |
| `Header` | Top header with page title |
| `MainContent` | Main content wrapper |
| `QuickCapture` | Fast task creation form |

### Page Hierarchy

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
    │   └── QuickCapture (Dashboard only)
    └── PageContent
        ├── TaskList (Tasks page)
        ├── ProjectList (Projects page)
        ├── ReviewPanel (Review page)
        └── ...
```

---

## 7. Design System

### Colors (Tailwind)

| Purpose | Color |
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

### Status Colors

| Status | Color |
|--------|-------|
| Inbox | `gray-500` |
| Active | `blue-500` |
| Completed | `green-500` |
| Waiting | `yellow-500` |
| Someday | `purple-500` |

### Priority Colors

| Priority | Color |
|----------|-------|
| Low | `slate-400` |
| Medium | `yellow-500` |
| High | `red-500` |

### Typography

- Font: System fonts (San Francisco, Inter, Segoe UI)
- Sizes: text-sm, text-base, text-lg, text-xl

### Spacing

- Tighter spacing for lists (compact mode)
- Standard spacing for cards

---

## 8. Implementation Roadmap

### Phase 1: Foundation
- Setup Next.js project with TypeScript
- Configure Tailwind CSS
- Setup directory structure
- Create base UI components

### Phase 2: API Layer
- Implement TodoAPIClient
- Create API modules (tasks, projects, tags, contexts, areas, inbox)
- Setup React Query

### Phase 3: Core Pages
- Dashboard with quick capture
- Tasks list with filters
- Inbox processing

### Phase 4: GTD Workflow
- Next Actions page
- Projects page
- Weekly Review page

### Phase 5: Organization
- Areas page
- Contexts page
- Tags page

### Phase 6: Polish
- Error handling
- Loading states
- Optimistic updates
- Responsive design

---

## 9. TypeScript Types

### Core Types

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

## 10. Success Criteria

- Full GTD workflow implemented (Capture, Clarify, Organize, Engage, Review)
- All API endpoints integrated
- Minimalist, clean UI
- Type-safe with TypeScript
- Optimistic updates for better UX
- Responsive design
- Error handling throughout

---

## References

- Todo API Documentation: `/docs/api todowka/`
- OpenAPI Spec: `/docs/api todowka/openapi.json`
- Integration Guide: `/docs/api todowka/INTEGRATION_GUIDE.md`
- Schema Documentation: `/docs/api todowka/SCHEMA_DOCUMENTATION.md`
