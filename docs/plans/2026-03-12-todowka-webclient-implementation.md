# Implementation Plan: Todo Web Client

**Date:** 2026-03-12
**Based on:** docs/plans/2026-03-12-todowka-webclient-design.md
**Status:** Ready for execution

---

## Summary Table

| # | Layer | Task | Effort | Depends on |
|---|-------|------|--------|------------|
| 1 | Foundation | Init Next.js project with TypeScript & dependencies | S | — |
| 2 | Foundation | Configure Tailwind CSS & design tokens | S | 1 |
| 3 | Foundation | Setup directory structure | XS | 1 |
| 4 | Types | Create TypeScript types file (types/index.ts) | S | 3 |
| 5 | API Client | Implement TodoAPIClient base class | S | 4 |
| 6 | API Client | Create tasks API module (lib/api/tasks.ts) | M | 5 |
| 7 | API Client | Create projects API module (lib/api/projects.ts) | M | 5 |
| 8 | API Client | Create inbox API module (lib/api/inbox.ts) | S | 5 |
| 9 | API Client | Create tags API module (lib/api/tags.ts) | S | 5 |
| 10 | API Client | Create contexts API module (lib/api/contexts.ts) | S | 5 |
| 11 | API Client | Create areas API module (lib/api/areas.ts) | S | 5 |
| 12 | API Client | Create notifications API module (lib/api/notifications.ts) | S | 5 |
| 13 | State | Create Task store (Zustand) | S | 4 |
| 14 | State | Create Navigation store (Zustand) | S | 4 |
| 15 | State | Create GTD store (Zustand) | S | 4 |
| 16 | State | Setup React Query client provider | M | 1 |
| 17 | Base UI | Create Button component | S | 2 |
| 18 | Base UI | Create Card component | S | 2 |
| 19 | Base UI | Create Input & Textarea components | S | 2 |
| 20 | Base UI | Create Select component | S | 2 |
| 21 | Base UI | Create Checkbox component | S | 2 |
| 22 | Base UI | Create Badge component | S | 2 |
| 23 | Base UI | Create Modal component | M | 17, 18 |
| 24 | Base UI | Create EmptyState component | S | 2 |
| 25 | Base UI | Create Spinner component | XS | 2 |
| 26 | Domain UI | Create TaskItem component | M | 4, 22 |
| 27 | Domain UI | Create TaskList component | M | 26 |
| 28 | Domain UI | Create TaskFilters component | S | 4, 19, 20, 22 |
| 29 | Domain UI | Create TaskForm component | M | 17, 19, 20, 21 |
| 30 | Domain UI | Create ProjectCard component | M | 4, 22 |
| 31 | Domain UI | Create ProjectList component | M | 30 |
| 32 | Domain UI | Create ProjectForm component | M | 17, 19 |
| 33 | Domain UI | Create ProgressBar component | S | 2 |
| 34 | Layout | Create Sidebar component | M | 17 |
| 35 | Layout | Create Header component | S | 17 |
| 36 | Layout | Create MainContent component | XS | 34, 35 |
| 37 | Layout | Create QuickCapture component | M | 17, 19, 29 |
| 38 | Hooks | Create useTasks hook | M | 6, 16 |
| 39 | Hooks | Create useProjects hook | M | 7, 16 |
| 40 | Hooks | Create useInbox hook | M | 8, 16 |
| 41 | Hooks | Create useTags hook | S | 9, 16 |
| 42 | Hooks | Create useContexts hook | S | 10, 16 |
| 43 | Hooks | Create useAreas hook | S | 11, 16 |
| 44 | Pages | Create root layout (app/layout.tsx) | S | 34, 35, 36, 16 |
| 45 | Pages | Create Dashboard page (app/page.tsx) | L | 37, 38, 39, 13, 15 |
| 46 | Pages | Create Inbox page (app/inbox/page.tsx) | L | 27, 40, 29 |
| 47 | Pages | Create Tasks page (app/tasks/page.tsx) | L | 27, 38, 28 |
| 48 | Pages | Create Next Actions page (app/tasks/next-actions/page.tsx) | M | 27, 38 |
| 49 | Pages | Create Projects list page (app/projects/page.tsx) | L | 31, 39, 32 |
| 50 | Pages | Create Project details page (app/projects/[id]/page.tsx) | L | 27, 30, 38, 39 |
| 51 | Pages | Create Areas page (app/areas/page.tsx) | M | 43, 29 |
| 52 | Pages | Create Contexts page (app/contexts/page.tsx) | M | 42, 29 |
| 53 | Pages | Create Tags page (app/tags/page.tsx) | M | 41, 29 |
| 54 | Pages | Create Weekly Review page (app/review/page.tsx) | L | 40, 38, 39 |
| 55 | Docs | Create README.md | S | — |
| 56 | Docs | Create environment setup docs | XS | 1 |
| 57 | Docs | Update AGENTS.md with build/test commands | XS | 55 |
| 58 | Refactor | Add error boundaries | M | 44 |
| 59 | Refactor | Add loading states | M | 25 |
| 60 | Refactor | Add optimistic updates | L | 38, 39, 40 |

---

## Detailed Task Cards

### L0-01 — Init Next.js project with TypeScript & dependencies

**Goal:** Initialize a Next.js 14 project with all required dependencies.

**Input:** Empty directory with git initialized.

**Output:** `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `.env.local` template.

**Done when:**
- `npm run dev` starts successfully on http://localhost:3000
- All dependencies installed:
  - `next`, `react`, `react-dom`
  - `typescript`, `@types/react`, `@types/node`
  - `tailwindcss`, `postcss`, `autoprefixer`
  - `@tanstack/react-query`
  - `zustand`
  - `react-hook-form`, `zod`, `@hookform/resolvers`
  - `date-fns`

**Est. effort:** S (1h)

---

### L0-02 — Configure Tailwind CSS & design tokens

**Goal:** Setup Tailwind CSS with custom colors and design tokens.

**Input:** Task L0-01 completed.

**Output:** `tailwind.config.ts` with custom colors, `globals.css` with base styles.

**Done when:** Tailwind classes work, custom colors (blue-600, slate-50, etc.) defined per design doc.

**Est. effort:** S (1h)

---

### L0-03 — Setup directory structure

**Goal:** Create all required directories.

**Input:** Task L0-01 completed.

**Output:** Directory structure per design:
```
src/app/
src/components/ui/
src/components/task/
src/components/project/
src/components/layout/
src/lib/api/
src/lib/hooks/
src/lib/utils/
src/types/
src/stores/
```

**Done when:** All directories exist with placeholder files.

**Est. effort:** XS (30min)

---

### L1-04 — Create TypeScript types file (types/index.ts)

**Goal:** Define all TypeScript types matching API schemas.

**Input:** Task L0-03 completed, API documentation.

**Output:** `src/types/index.ts` with:
- `TaskStatus`, `TaskPriority`, `ProjectStatus`, `NotificationStatus`
- `Task`, `Project`, `Tag`, `Context`, `Area`
- `TaskCreate`, `TaskUpdate`, `ProjectCreate`, `ProjectUpdate`
- `InboxCreate`
- `PaginatedResponse<T>`
- Filter types

**Done when:** All types from design doc defined with correct properties.

**Est. effort:** S (1h)

---

### L2-05 — Implement TodoAPIClient base class

**Goal:** Create base API client with error handling.

**Input:** Task L1-04 completed.

**Output:** `src/lib/api/client.ts` with `TodoAPIClient` class and `APIError`.

**Done when:** Can make requests, errors properly thrown with status codes.

**Est. effort:** S (1h)

---

### L2-06 — Create tasks API module

**Goal:** Implement full tasks API integration.

**Input:** Task L2-05 completed, L1-04 completed.

**Output:** `src/lib/api/tasks.ts` with `tasksAPI` object with:
- `getAll(filters)`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`
- `complete(id)`, `setNextAction(id)`, `toggleComplete(id)`

**Done when:** All methods typed correctly, make calls to `/api/v1/tasks/*` endpoints.

**Est. effort:** M (2h)

---

### L2-07 — Create projects API module

**Goal:** Implement projects API integration.

**Input:** Task L2-05 completed, L1-04 completed.

**Output:** `src/lib/api/projects.ts` with `projectsAPI`:
- `getAll(page, limit)`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`
- `complete(id)`

**Done when:** All methods typed, calls to `/api/v1/projects/*` endpoints.

**Est. effort:** M (2h)

---

### L2-08 — Create inbox API module

**Goal:** Implement inbox API integration.

**Input:** Task L2-05 completed, L1-04 completed.

**Output:** `src/lib/api/inbox.ts` with `inboxAPI`:
- `getAll()`, `create(data)`

**Done when:** Calls to `/api/v1/inbox/*` endpoints.

**Est. effort:** S (1h)

---

### L2-09 — Create tags API module

**Goal:** Implement tags API integration.

**Input:** Task L2-05 completed, L1-04 completed.

**Output:** `src/lib/api/tags.ts` with full CRUD.

**Done when:** Calls to `/api/v1/tags/*` endpoints.

**Est. effort:** S (1h)

---

### L2-10 — Create contexts API module

**Goal:** Implement contexts API integration.

**Input:** Task L2-05 completed, L1-04 completed.

**Output:** `src/lib/api/contexts.ts` with full CRUD.

**Done when:** Calls to `/api/v1/contexts/*` endpoints.

**Est. effort:** S (1h)

---

### L2-11 — Create areas API module

**Goal:** Implement areas API integration.

**Input:** Task L2-05 completed, L1-04 completed.

**Output:** `src/lib/api/areas.ts` with full CRUD.

**Done when:** Calls to `/api/v1/areas/*` endpoints.

**Est. effort:** S (1h)

---

### L2-12 — Create notifications API module

**Goal:** Implement notifications API integration.

**Input:** Task L2-05 completed, L1-04 completed.

**Output:** `src/lib/api/notifications.ts` with full CRUD.

**Done when:** Calls to `/api/v1/notifications/*` endpoints.

**Est. effort:** S (1h)

---

### L3-13 — Create Task store (Zustand)

**Goal:** Implement Zustand store for task-related UI state.

**Input:** Task L1-04 completed.

**Output:** `src/stores/useTaskStore.ts` with:
- State: `selectedTask`, `filters`, `viewMode`
- Actions: `selectTask`, `setFilters`, `setViewMode`, `clearFilters`

**Done when:** Store works, TypeScript types correct.

**Est. effort:** S (1h)

---

### L3-14 — Create Navigation store (Zustand)

**Goal:** Implement Zustand store for navigation UI state.

**Input:** Task L1-04 completed.

**Output:** `src/stores/useNavigationStore.ts` with:
- State: `currentPage`, `sidebarOpen`
- Actions: `setCurrentPage`, `toggleSidebar`

**Done when:** Store works, persists sidebar state.

**Est. effort:** S (1h)

---

### L3-15 — Create GTD store (Zustand)

**Goal:** Implement Zustand store for GTD-specific state.

**Input:** Task L1-04 completed.

**Output:** `src/stores/useGTDStore.ts` with:
- State: `inboxCount`, `nextActionsCount`, `reviewMode`
- Actions: `setReviewMode`

**Done when:** Store works.

**Est. effort:** S (1h)

---

### L3-16 — Setup React Query client provider

**Goal:** Configure TanStack Query with provider and default options.

**Input:** Task L0-01 completed.

**Output:** `src/lib/QueryClientProvider.tsx` wrapping `QueryClient` with retry logic, error handling.

**Done when:** Provider wraps app in layout, default queries configured.

**Est. effort:** M (2h)

---

### L4-17 — Create Button component

**Goal:** Implement reusable Button component with variants.

**Input:** Task L0-02 completed.

**Output:** `src/components/ui/Button.tsx` with variants: `primary`, `secondary`, `ghost`, `destructive`.

**Done when:** Component accepts all Tailwind style props, renders correctly.

**Est. effort:** S (1h)

---

### L4-18 — Create Card component

**Goal:** Implement reusable Card component.

**Input:** Task L0-02 completed.

**Output:** `src/components/ui/Card.tsx` with Card, CardHeader, CardContent subcomponents.

**Done when:** Card displays content with proper padding and borders.

**Est. effort:** S (1h)

---

### L4-19 — Create Input & Textarea components

**Goal:** Implement form input components.

**Input:** Task L0-02 completed.

**Output:** `src/components/ui/Input.tsx` and `src/components/ui/Textarea.tsx`.

**Done when:** Components work with React Hook Form.

**Est. effort:** S (1h)

---

### L4-20 — Create Select component

**Goal:** Implement dropdown select component.

**Input:** Task L0-02 completed.

**Output:** `src/components/ui/Select.tsx` with Select, SelectTrigger, SelectContent, SelectItem.

**Done when:** Component renders options, handles selection.

**Est. effort:** S (1h)

---

### L4-21 — Create Checkbox component

**Goal:** Implement checkbox component.

**Input:** Task L0-02 completed.

**Output:** `src/components/ui/Checkbox.tsx`.

**Done when:** Component toggles state.

**Est. effort:** S (1h)

---

### L4-22 — Create Badge component

**Goal:** Implement status/priority badge component.

**Input:** Task L0-02 completed, Task L1-04 completed.

**Output:** `src/components/ui/Badge.tsx` with:
- Status variants: inbox, active, completed, waiting, someday
- Priority variants: low, medium, high

**Done when:** Badges display with correct colors per design.

**Est. effort:** S (1h)

---

### L4-23 — Create Modal component

**Goal:** Implement modal dialog component.

**Input:** Task L4-17, L4-18 completed.

**Output:** `src/components/ui/Modal.tsx` with open/close state, backdrop click handling.

**Done when:** Modal opens/closes, displays content.

**Est. effort:** M (2h)

---

### L4-24 — Create EmptyState component

**Goal:** Implement empty state placeholder component.

**Input:** Task L0-02 completed.

**Output:** `src/components/ui/EmptyState.tsx` with icon, title, description.

**Done when:** Displays when no data exists.

**Est. effort:** S (1h)

---

### L4-25 — Create Spinner component

**Goal:** Implement loading spinner.

**Input:** Task L0-02 completed.

**Output:** `src/components/ui/Spinner.tsx`.

**Done when:** Spinner animates.

**Est. effort:** XS (30min)

---

### L5-26 — Create TaskItem component

**Goal:** Implement single task display component.

**Input:** Task L4-22 completed, Task L1-04 completed.

**Output:** `src/components/task/TaskItem.tsx` with:
- Task title, description
- Status and priority badges
- Action buttons (Complete, Next Action, Edit, Delete)

**Done when:** Displays task info, handles actions.

**Est. effort:** M (2h)

---

### L5-27 — Create TaskList component

**Goal:** Implement task list container.

**Input:** Task L5-26 completed.

**Output:** `src/components/task/TaskList.tsx` with list of TaskItems, empty state.

**Done when:** Displays tasks, shows EmptyState when empty.

**Est. effort:** M (2h)

---

### L5-28 — Create TaskFilters component

**Goal:** Implement task filter controls.

**Input:** Task L4-19, L4-20, L4-22 completed, Task L1-04 completed.

**Output:** `src/components/task/TaskFilters.ts` with:
- Status tabs (Inbox, Active, Waiting, Someday, Completed)
- Priority, context, tag, project dropdowns
- Sort options

**Done when:** Filters update, send filter values to parent.

**Est. effort:** S (1h)

---

### L5-29 — Create TaskForm component

**Goal:** Implement task creation/editing form.

**Input:** Task L4-17, L4-19, L4-20, L4-21 completed, Task L1-04 completed.

**Output:** `src/components/task/TaskForm.tsx` with React Hook Form:
- Title, description inputs
- Project, context, tag selectors
- Priority dropdown
- Validation with Zod

**Done when:** Form validates, submits data, handles errors.

**Est. effort:** M (2h)

---

### L5-30 — Create ProjectCard component

**Goal:** Implement project display card.

**Input:** Task L4-22 completed, Task L1-04 completed.

**Output:** `src/components/project/ProjectCard.tsx` with:
- Project name, description
- Progress bar
- Status badge
- Edit/Delete actions

**Done when:** Displays project info and progress.

**Est. effort:** M (2h)

---

### L5-31 — Create ProjectList component

**Goal:** Implement project list container.

**Input:** Task L5-30 completed.

**Output:** `src/components/project/ProjectList.tsx` with grid of ProjectCards.

**Done when:** Displays projects in grid layout.

**Est. effort:** M (2h)

---

### L5-32 — Create ProjectForm component

**Goal:** Implement project creation/editing form.

**Input:** Task L4-17, L4-19 completed, Task L1-04 completed.

**Output:** `src/components/project/ProjectForm.tsx` with:
- Name, description inputs
- Area selector
- Validation

**Done when:** Form validates, submits data.

**Est. effort:** M (2h)

---

### L5-33 — Create ProgressBar component

**Goal:** Implement visual progress bar.

**Input:** Task L0-02 completed.

**Output:** `src/components/project/ProgressBar.tsx`.

**Done when:** Bar shows percentage width.

**Est. effort:** S (1h)

---

### L6-34 — Create Sidebar component

**Goal:** Implement navigation sidebar.

**Input:** Task L4-17 completed.

**Output:** `src/components/layout/Sidebar.tsx` with:
- Nav items: Inbox, Tasks, Next Actions, Projects, Areas, Contexts, Tags, Review
- Active state highlighting
- Collapsible on mobile

**Done when:** Navigation works, highlights current page.

**Est. effort:** M (2h)

---

### L6-35 — Create Header component

**Goal:** Implement top header.

**Input:** Task L4-17 completed.

**Output:** `src/components/layout/Header.tsx` with:
- Page title
- Menu toggle button (mobile)

**Done when:** Displays title, toggles sidebar.

**Est. effort:** S (1h)

---

### L6-36 — Create MainContent component

**Goal:** Implement main content wrapper.

**Input:** Task L6-34, L6-35 completed.

**Output:** `src/components/layout/MainContent.tsx` layout wrapper.

**Done when:** Wraps page content with proper spacing.

**Est. effort:** XS (30min)

---

### L6-37 — Create QuickCapture component

**Goal:** Implement quick task capture form.

**Input:** Task L4-17, L4-19, L5-29 completed.

**Output:** `src/components/layout/QuickCapture.tsx` with:
- Title input only
- Submit button
- Creates task via inbox API

**Done when:** Creates task in Inbox on submit.

**Est. effort:** M (2h)

---

### L7-38 — Create useTasks hook

**Goal:** Implement React Query hooks for tasks.

**Input:** Task L2-06 completed, Task L3-16 completed.

**Output:** `src/lib/hooks/useTasks.ts` with:
- `useTasks(filters)`
- `useTask(id)`
- `useNextActions()`
- `useCreateTask()`, `useUpdateTask()`, `useDeleteTask()`
- `useCompleteTask()`, `useSetNextAction()`

**Done when:** All hooks fetch/mutate data correctly, invalidate queries on mutations.

**Est. effort:** M (2h)

---

### L7-39 — Create useProjects hook

**Goal:** Implement React Query hooks for projects.

**Input:** Task L2-07 completed, Task L3-16 completed.

**Output:** `src/lib/hooks/useProjects.ts` with:
- `useProjects(page, limit)`
- `useProject(id)`
- `useCreateProject()`, `useUpdateProject()`, `useDeleteProject()`
- `useCompleteProject()`

**Done when:** All hooks work correctly.

**Est. effort:** M (2h)

---

### L7-40 — Create useInbox hook

**Goal:** Implement React Query hooks for inbox.

**Input:** Task L2-08 completed, Task L3-16 completed.

**Output:** `src/lib/hooks/useInbox.ts` with:
- `useInbox()` - fetch inbox tasks
- `useCreateInboxTask()` - create via inbox API

**Done when:** Hooks fetch/mutate inbox data.

**Est. effort:** M (2h)

---

### L7-41 — Create useTags hook

**Goal:** Implement React Query hooks for tags.

**Input:** Task L2-09 completed, Task L3-16 completed.

**Output:** `src/lib/hooks/useTags.ts` with CRUD hooks.

**Done when:** Hooks work correctly.

**Est. effort:** S (1h)

---

### L7-42 — Create useContexts hook

**Goal:** Implement React Query hooks for contexts.

**Input:** Task L2-10 completed, Task L3-16 completed.

**Output:** `src/lib/hooks/useContexts.ts` with CRUD hooks.

**Done when:** Hooks work correctly.

**Est. effort:** S (1h)

---

### L7-43 — Create useAreas hook

**Goal:** Implement React Query hooks for areas.

**Input:** Task L2-11 completed, Task L3-16 completed.

**Output:** `src/lib/hooks/useAreas.ts` with CRUD hooks.

**Done when:** Hooks work correctly.

**Est. effort:** S (1h)

---

### L8-44 — Create root layout (app/layout.tsx)

**Goal:** Implement app layout with Sidebar, Header, MainContent.

**Input:** Task L6-34, L6-35, L6-36, L3-16 completed.

**Output:** `src/app/layout.tsx` wrapping page with layout components and QueryClientProvider.

**Done when:** Layout displays on all pages, sidebar works.

**Est. effort:** S (1h)

---

### L8-45 — Create Dashboard page (app/page.tsx)

**Goal:** Implement dashboard with quick capture, counters, next actions, projects.

**Input:** Task L6-37, L7-38, L7-39, L3-13, L3-15 completed.

**Output:** `src/app/page.tsx` with:
- QuickCapture form
- Counters (Inbox, Active, Next Actions)
- List of 5 Next Actions
- Active projects with progress

**Done when:** Dashboard displays all widgets, quick capture creates tasks.

**Est. effort:** L (4h)

---

### L8-46 — Create Inbox page (app/inbox/page.tsx)

**Goal:** Implement inbox processing page.

**Input:** Task L5-27, L7-40, L5-29 completed.

**Output:** `src/app/(dashboard)/inbox/page.tsx` with:
- List of inbox tasks
- Quick actions: Clarify (edit), Delete
- "Process All" button

**Done when:** Displays inbox tasks, clarifying moves to TaskForm modal.

**Est. effort:** L (4h)

---

### L8-47 — Create Tasks page (app/tasks/page.tsx)

**Goal:** Implement tasks list with filters.

**Input:** Task L5-27, L7-38, L5-28 completed.

**Output:** `src/app/(dashboard)/tasks/page.tsx` with:
- Status tabs
- TaskFilters component
- TaskList
- Action buttons

**Done when:** Displays filtered tasks, filters work.

**Est. effort:** L (4h)

---

### L8-48 — Create Next Actions page (app/tasks/next-actions/page.tsx)

**Goal:** Implement next actions view.

**Input:** Task L5-27, L7-38 completed.

**Output:** `src/app/(dashboard)/tasks/next-actions/page.tsx` with list of next actions.

**Done when:** Displays tasks with `is_next_action: true`, complete works.

**Est. effort:** M (2h)

---

### L8-49 — Create Projects list page (app/projects/page.tsx)

**Goal:** Implement projects list with create.

**Input:** Task L5-31, L7-39, L5-32 completed.

**Output:** `src/app/(dashboard)/projects/page.tsx` with ProjectList and create button.

**Done when:** Displays projects, create opens ProjectForm modal.

**Est. effort:** L (4h)

---

### L8-50 — Create Project details page (app/projects/[id]/page.tsx)

**Goal:** Implement project details with tasks.

**Input:** Task L5-27, L5-30, L7-38, L7-39 completed.

**Output:** `src/app/(dashboard)/projects/[id]/page.tsx` with:
- Project info and progress
- Tasks in project
- Add task button

**Done when:** Displays project details, tasks list, can add tasks.

**Est. effort:** L (4h)

---

### L8-51 — Create Areas page (app/areas/page.tsx)

**Goal:** Implement areas management.

**Input:** Task L7-43, L5-29 completed.

**Output:** `src/app/(dashboard)/areas/page.tsx` with list of areas and create/edit/delete.

**Done when:** Displays areas, can CRUD.

**Est. effort:** M (2h)

---

### L8-52 — Create Contexts page (app/contexts/page.tsx)

**Goal:** Implement contexts management.

**Input:** Task L7-42, L5-29 completed.

**Output:** `src/app/(dashboard)/contexts/page.tsx` with list of contexts and CRUD.

**Done when:** Displays contexts, can CRUD.

**Est. effort:** M (2h)

---

### L8-53 — Create Tags page (app/tags/page.tsx)

**Goal:** Implement tags management.

**Input:** Task L7-41, L5-29 completed.

**Output:** `src/app/(dashboard)/tags/page.tsx` with list of tags with colors and CRUD.

**Done when:** Displays tags, can CRUD.

**Est. effort:** M (2h)

---

### L8-54 — Create Weekly Review page (app/review/page.tsx)

**Goal:** Implement guided weekly review workflow.

**Input:** Task L7-40, L7-38, L7-39 completed.

**Output:** `src/app/(dashboard)/review/page.tsx` with:
1. Inbox Review step
2. Projects Review step
3. Next Actions Selection step
4. Someday Review step

**Done when:** Steps work, can navigate between steps, updates reflect.

**Est. effort:** L (4h)

---

### L9-55 — Create README.md

**Goal:** Document project setup and usage.

**Input:** Completed project.

**Output:** `README.md` with:
- Project description
- Setup instructions
- Environment variables
- Run commands
- GTD workflow overview

**Done when:** README complete.

**Est. effort:** S (1h)

---

### L9-56 — Create environment setup docs

**Goal:** Document environment configuration.

**Input:** Task L0-01 completed.

**Output:** `.env.local.example` or setup instructions.

**Done when:** Example environment file exists.

**Est. effort:** XS (30min)

---

### L9-57 — Update AGENTS.md with build/test commands

**Goal:** Document commands for linting, building, testing.

**Input:** Completed project.

**Output:** Updated `AGENTS.md` with:
- `npm run lint` command
- `npm run build` command
- Any test commands

**Done when:** AGENTS.md has commands.

**Est. effort:** XS (30min)

---

### L10-58 — Add error boundaries

**Goal:** Implement error boundary components.

**Input:** Task L8-44 completed.

**Output:** Error boundary component wrapping page content.

**Done when:** Errors display gracefully, app doesn't crash.

**Est. effort:** M (2h)

---

### L10-59 — Add loading states

**Goal:** Implement loading spinners/skeletons throughout.

**Input:** Task L4-25 completed.

**Output:** Loading states in all lists, forms.

**Done when:** Spinner shows while loading data.

**Est. effort:** M (2h)

---

### L10-60 — Add optimistic updates

**Goal:** Implement optimistic UI updates for better UX.

**Input:** Task L7-38, L7-39, L7-40 completed.

**Output:** Optimistic updates in mutation hooks (create, update, delete).

**Done when:** UI updates immediately, rolls back on error.

**Est. effort:** L (4h)

---

## LLM Execution Guide

### System Prompt (set once)

```
You are building a Todo Web Client - a GTD task management app.
Tech stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, TanStack Query, React Hook Form + Zod.
API: External REST API at http://localhost:8000/api/v1

Key principles:
- Minimalist UI with Tailwind CSS
- Full GTD workflow: Capture, Clarify, Organize, Engage, Review
- Type-safe with TypeScript
- Optimistic updates for better UX
- Responsive design

Design doc: docs/plans/2026-03-12-todowka-webclient-design.md
API docs: docs/api todowka/
```

### Execution Order

Execute tasks in numerical order (L0-01 → L0-02 → ... → L10-60).

For each task:
1. Read the task card carefully
2. Review the design doc for context
3. Check dependencies (previous tasks completed)
4. Implement the task
5. Verify the "Done when" condition
6. Move to next task

### Context Between Tasks

- Output of task N is input for task N+1
- Keep file paths consistent with design
- Follow TypeScript conventions from L1-04
- Use components from L4 in L5 and L6
- Use hooks from L7 in L8

---

## Success Criteria

- [ ] All 60 tasks completed
- [ ] Full GTD workflow functional
- [ ] All pages render correctly
- [ ] API integration working
- [ ] Type errors: 0
- [ ] Responsive on mobile
- [ ] Optimistic updates working
- [ ] Error handling in place

---

**Total Estimated Effort:** ~120 hours (15 days @ 8h/day)
