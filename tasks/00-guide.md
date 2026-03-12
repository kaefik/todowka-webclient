# Todo Web Client — Execution Guide

This guide applies to ALL tasks in this project. Follow it strictly.

---

## Project Context

**Project:** Todo Web Client
**Type:** GTD Task Management Web Application
**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- TanStack Query (data fetching)
- React Hook Form + Zod (forms)
- date-fns (date handling)

**API:** External REST API at `http://localhost:8000/api/v1` (no authentication required)

---

## Development Principles

### 1. Code Style
- Use TypeScript for all files (no .js files)
- Follow existing file structure strictly
- No placeholder comments like `// TODO` — implement everything
- Use functional components with hooks (no class components)
- Keep components focused and small

### 2. API Integration
- All API calls use the TodoAPIClient class
- Use React Query hooks for data fetching
- Handle errors gracefully with user-friendly messages
- Implement loading states with Spinner component
- Implement optimistic updates where appropriate

### 3. State Management
- Server state → React Query (tasks, projects, tags, contexts, areas)
- UI state → Zustand stores (filters, navigation, selections)
- Form state → React Hook Form

### 4. UI/UX
- Minimalist design per design doc
- Use Tailwind CSS classes only (no custom CSS unless necessary)
- Responsive by default (mobile-first)
- Accessible components (proper ARIA labels, keyboard navigation)

---

## File Organization

**Always place files in these exact locations:**

```
src/
├── app/                    # Next.js pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Dashboard
│   ├── (dashboard)/        # Route group
│   │   ├── inbox/
│   │   ├── tasks/
│   │   ├── projects/
│   │   └── review/
├── components/
│   ├── ui/                 # Base components
│   ├── task/               # Task components
│   ├── project/            # Project components
│   └── layout/             # Layout components
├── lib/
│   ├── api/                # API client modules
│   ├── hooks/              # React Query hooks
│   └── utils/              # Utility functions
├── types/                  # TypeScript types
└── stores/                 # Zustand stores
```

---

## Common Patterns

### Component Pattern

```typescript
'use client'; // Required for client components

import { useState } from 'react';

interface Props {
  // Define props here
}

export function ComponentName({ prop }: Props) {
  // Component logic
  return (
    <div className="tailwind-classes">
      {/* JSX */}
    </div>
  );
}
```

### API Client Pattern

```typescript
import { TodoAPIClient } from './client';

const api = new TodoAPIClient();

export const tasksAPI = {
  async getAll() {
    return await api.get<Task[]>('/tasks');
  }
};
```

### React Query Hook Pattern

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksAPI.getAll()
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskCreate) => tasksAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
}
```

### Zustand Store Pattern

```typescript
import { create } from 'zustand';

interface TaskStore {
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  selectedTask: null,
  setSelectedTask: (task) => set({ selectedTask: task })
}));
```

---

## Testing Your Work

After completing a task:

1. **Type Check:** Run `npm run typecheck` (if configured) or `tsc --noEmit`
2. **Lint:** Run `npm run lint` (if configured)
3. **Manual Test:** Test the feature in browser
4. **API Test:** Verify API calls are correct

---

## Import Paths

**Always use absolute imports from src root:**
```typescript
import { Task } from '@/types';
import { useTasks } from '@/lib/hooks/useTasks';
```

Not relative paths like `import { Task } from '../../../types'`.

---

## Environment Variables

**Add to .env.local (don't commit):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run typecheck    # Type check
npm run lint        # Lint code
```

---

## Error Handling Pattern

```typescript
try {
  const result = await api.post('/tasks', data);
  // Handle success
} catch (error) {
  if (error instanceof APIError) {
    // Handle specific error
  }
  // Handle generic error
}
```

---

## Component Export Style

**Always use named exports:**
```typescript
export function ComponentName() { }

// NOT default export:
// export default function ComponentName() { }
```

This makes imports more explicit and tree-shaking friendly.

---

## Tailwind Color Reference

Use these custom colors (defined in tailwind.config.ts):

- **Primary:** `blue-600`
- **Background:** `slate-50`
- **Card:** `white`
- **Border:** `slate-200`
- **Text Primary:** `slate-900`
- **Text Secondary:** `slate-600`

**Status Colors:**
- Inbox: `gray-500`
- Active: `blue-500`
- Completed: `green-500`
- Waiting: `yellow-500`
- Someday: `purple-500`

**Priority Colors:**
- Low: `slate-400`
- Medium: `yellow-500`
- High: `red-500`

---

## When in Doubt

1. Check the design doc: `docs/plans/2026-03-12-todowka-webclient-design.md`
2. Check the API docs: `docs/api todowka/`
3. Follow patterns from existing code
4. Keep it minimal — YAGNI (You Aren't Gonna Need It)

---

**Last updated:** 2026-03-12
