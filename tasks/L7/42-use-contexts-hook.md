# L7-42 — Create useContexts hook

## Goal

Implement React Query hooks for contexts.

## Input

Task L2-10 completed, Task L3-16 completed.

## Output

`src/lib/hooks/useContexts.ts` with useContexts and CRUD hooks.

## Implementation

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contextsAPI } from '@/lib/api/contexts';
import type { Context, ContextCreate, ContextUpdate } from '@/types';

export function useContexts() {
  return useQuery({
    queryKey: ['contexts'],
    queryFn: () => contextsAPI.getAll(),
  });
}

export function useContext(id: number) {
  return useQuery({
    queryKey: ['context', id],
    queryFn: () => contextsAPI.getById(id),
    enabled: !!id,
  });
}

export function useCreateContext() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ContextCreate) => contextsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contexts'] });
    },
  });
}

export function useUpdateContext() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ContextUpdate }) =>
      contextsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contexts'] });
    },
  });
}

export function useDeleteContext() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contextsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contexts'] });
    },
  });
}
```

## Done When

- All hooks work correctly

## Effort

S (1 hour)

## Depends On

L2-10, L3-16
