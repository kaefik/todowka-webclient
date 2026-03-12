# L3-13 — Create Task store (Zustand)

## Goal

Implement Zustand store for task-related UI state.

## Input

Task L1-04 completed.

## Output

`src/stores/useTaskStore.ts` with TaskStore.

## Implementation

```typescript
import { create } from 'zustand';
import type { Task, TaskFilters } from '@/types';

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

export const useTaskStore = create<TaskStore>((set) => ({
  // Initial state
  selectedTask: null,
  filters: {},
  viewMode: 'list',

  // Actions
  selectTask: (task) => set({ selectedTask: task }),
  setFilters: (filters) => set({ filters }),
  setViewMode: (viewMode) => set({ viewMode }),
  clearFilters: () => set({ filters: {} }),
}));
```

## Done When

- Store implements all state and actions
- TypeScript types correct
- Store can be used in components

## Effort

S (1 hour)

## Depends On

L1-04
