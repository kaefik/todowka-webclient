# L7-39 — Create useProjects hook

## Goal

Implement React Query hooks for projects.

## Input

Task L2-07 completed, Task L3-16 completed.

## Output

`src/lib/hooks/useProjects.ts` with useProjects and mutation hooks.

## Implementation

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsAPI } from '@/lib/api/projects';
import type { Project, ProjectCreate, ProjectUpdate } from '@/types';

export function useProjects(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['projects', page, limit],
    queryFn: () => projectsAPI.getAll(page, limit),
  });
}

export function useProject(id: number) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsAPI.getById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectCreate) => projectsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProjectUpdate }) =>
      projectsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => projectsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useCompleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => projectsAPI.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
```

## Done When

- All hooks work correctly
- Queries invalidate on mutations

## Effort

M (2 hours)

## Depends On

L2-07, L3-16
