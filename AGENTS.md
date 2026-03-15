# AGENTS.md

## Available Commands

### Development

```bash
npm run dev
```

Starts Next.js development server on http://localhost:3000.

### Build

```bash
npm run build
```

Creates an optimized production build.

### Lint

```bash
npm run lint
```

Runs ESLint to check code quality.

### Type Check

```bash
npm run typecheck
```

Runs TypeScript compiler to check types.

### Start Production

```bash
npm start
```

Starts production server (requires build first).

## When to Run

- **Before committing:** Run `npm run lint` and `npm run typecheck`
- **Before deployment:** Run `npm run build`
- **During development:** Use `npm run dev`

## Project Overview

**ToDowka Web Client** is a GTD (Getting Things Done) task management application built with Next.js.

### Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS 3.0
- **State Management:** Zustand (UI state), TanStack Query (server state)
- **Forms:** React Hook Form + Zod
- **Utilities:** date-fns

### Key Features

- **Capture:** Quick capture tasks into Inbox
- **Clarify:** Process inbox items with full task details
- **Organize:** Organize by projects, contexts, tags, and areas
- **Engage:** Focus on Next Actions
- **Review:** Guided weekly review workflow

### Architecture

```
src/
├── app/                    # Next.js pages (App Router)
├── components/             # React components
│   ├── ui/              # Base UI components (Button, Modal, Input, etc.)
│   ├── task/            # Task-specific components (TaskItem, TaskList, TaskForm)
│   ├── project/         # Project-specific components (ProjectCard, ProjectList)
│   └── layout/          # Layout components (Sidebar, Header, BottomNavigation)
├── lib/                  # Utilities and API
│   ├── api/             # API client modules (tasks, projects, inbox, etc.)
│   ├── hooks/           # React Query hooks (useTasks, useProjects, etc.)
│   └── QueryClientProvider.tsx  # TanStack Query setup
├── types/                # TypeScript types (Task, Project, etc.)
└── stores/               # Zustand stores (useTaskStore, useGTDStore, etc.)
```

### Important Patterns

#### React Query Hooks
- All API calls go through custom hooks in `src/lib/hooks/`
- Hooks include optimistic updates and cache management
- Examples: `useTasks`, `useCreateTask`, `useUpdateTask`, `useDeleteTask`

#### Error Handling
- Global API error handling via `APIErrorHandler` component
- Error boundary wrapping entire app
- API client shows Russian error messages: "Сервис недоступен. Проверьте подключение к интернету."

#### State Management
- **Zustand:** UI state (selected task, filters, view mode)
- **TanStack Query:** Server state with caching and optimistic updates

#### Task Status Flow
- `inbox` → `active` → `completed`
- Can also go to `waiting` or `someday`
- Soft delete with `deleted_at` timestamp

#### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` maps to `./src/*`
- Target: ES2017

#### Mobile Responsiveness
- Bottom navigation on mobile (`<BottomNavigation />`)
- Responsive grid layouts with `sm:` breakpoints
- Mobile-optimized components

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### API Integration

The app connects to a REST API at the configured `NEXT_PUBLIC_API_URL`.
API endpoints are defined in `src/lib/api/` modules:
- `tasks.ts` - Task CRUD operations
- `projects.ts` - Project operations
- `inbox.ts` - Inbox capture
- And more for contexts, areas, tags, notifications

### Testing Notes

- Error boundary catches and displays React errors
- API client includes error handling with user-friendly messages
- Optimistic updates provide immediate UI feedback

## Troubleshooting

### Build Fails

1. Run typecheck: `npm run typecheck`
2. Fix any type errors
3. Clear cache: `rm -rf .next`
4. Try build again

### Lint Errors

1. Run `npm run lint` to see all errors
2. Fix errors or add `// eslint-disable-next-line` if necessary

### API Connection Issues

1. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
2. Ensure API server is running on the specified port
3. Check browser console for network errors
4. API client shows "Сервис недоступен" if connection fails

### State Not Updating

1. Check React Query DevTools (if installed)
2. Verify query keys match between mutations and queries
3. Check if optimistic updates are properly set up in hooks
4. Ensure `invalidateQueries` is called after mutations

### TypeScript Path Aliases Not Working

1. Verify `tsconfig.json` has correct path mappings
2. Ensure imports use `@/` prefix correctly
3. Restart TypeScript server in your IDE
