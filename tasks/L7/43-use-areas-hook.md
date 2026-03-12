# L7-43 — Create useAreas hook

## Goal

Implement React Query hooks for areas.

## Input

Task L2-11 completed, Task L3-16 completed.

## Output

`src/lib/hooks/useAreas.ts` with useAreas and CRUD hooks.

## Implementation

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { areasAPI } from '@/lib/api/areas';
import type { Area, AreaCreate, AreaUpdate } from '@/types';

export function useAreas() {
  return useQuery({
    queryKey: ['areas'],
    queryFn: () => areasAPI.getAll(),
  });
}

export function useArea(id: number) {
  return useQuery({
    queryKey: ['area', id],
    queryFn: () => areasAPI.getById(id),
    enabled: !!id,
  });
}

export function useCreateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AreaCreate) => areasAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
    },
  });
}

export function useUpdateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AreaUpdate }) =>
      areasAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
    },
  });
}

export function useDeleteArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => areasAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
    },
  });
}
```

## Done When

- All hooks work correctly

## Effort

S (1 hour)

## Depends On

L2-11, L3-16
