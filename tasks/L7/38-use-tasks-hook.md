# L7-38 — Create useTasks hook

## Goal

Implement React Query hooks for tasks.

## Input

Task L2-06 completed, Task L3-16 completed.

## Output

`src/lib/hooks/useTasks.ts` with useTasks and mutation hooks.

## Implementation

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '@/lib/api/tasks';
import type { Task, TaskCreate, TaskUpdate, TaskFilters } from '@/types';

export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksAPI.getAll(filters),
  });
}

export function useTask(id: number) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => tasksAPI.getById(id),
    enabled: !!id,
  });
}

export function useNextActions() {
  return useQuery({
    queryKey: ['nextActions'],
    queryFn: () => tasksAPI.getNextActions(),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskCreate) => tasksAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskUpdate }) =>
      tasksAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tasksAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tasksAPI.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['nextActions'] });
    },
  });
}

export function useSetNextAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tasksAPI.setNextAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['nextActions'] });
    },
  });
}
```

## Done When

- All hooks fetch/mutate data correctly
- Queries invalidate on mutations
- nextActions invalidated on task mutations

## Effort

M (2 hours)

## Depends On

L2-06, L3-16
