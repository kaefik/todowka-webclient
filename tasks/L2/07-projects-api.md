# L2-07 — Create projects API module

## Goal

Implement projects API integration.

## Input

Task L2-05 completed, L1-04 completed.

## Output

`src/lib/api/projects.ts` with projectsAPI object.

## Implementation

```typescript
import { TodoAPIClient } from './client';
import type { Project, ProjectCreate, ProjectUpdate, PaginatedResponse } from '@/types';

const api = new TodoAPIClient();

export const projectsAPI = {
  async getAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Project>> {
    return api.get<PaginatedResponse<Project>>(`/projects?page=${page}&limit=${limit}`);
  },

  async getById(id: number): Promise<Project> {
    return api.get<Project>(`/projects/${id}`);
  },

  async create(data: ProjectCreate): Promise<Project> {
    return api.post<Project>('/projects', data);
  },

  async update(id: number, data: ProjectUpdate): Promise<Project> {
    return api.put<Project>(`/projects/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/projects/${id}`);
  },

  async complete(id: number): Promise<Project> {
    return api.post<Project>(`/projects/${id}/complete`, {});
  }
};
```

## Done When

- All CRUD methods implemented
- Methods call `/api/v1/projects/*` endpoints
- Pagination works correctly

## Effort

M (2 hours)

## Depends On

L2-05, L1-04
