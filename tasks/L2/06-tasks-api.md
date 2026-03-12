# L2-06 — Create tasks API module

## Goal

Implement full tasks API integration.

## Input

Task L2-05 completed, L1-04 completed.

## Output

`src/lib/api/tasks.ts` with tasksAPI object.

## Implementation

```typescript
import { TodoAPIClient } from './client';
import type { Task, TaskCreate, TaskUpdate } from '@/types';

const api = new TodoAPIClient();

export const tasksAPI = {
  async getAll(filters?: any): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.project_id) params.append('project_id', String(filters.project_id));
    if (filters?.context_id) params.append('context_id', String(filters.context_id));
    if (filters?.tag_id) params.append('tag_ids', String(filters.tag_id));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.order) params.append('order', filters.order);

    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get<Task[]>(`/tasks${query}`);
  },

  async getById(id: number): Promise<Task> {
    return api.get<Task>(`/tasks/${id}`);
  },

  async create(data: TaskCreate): Promise<Task> {
    return api.post<Task>('/tasks', data);
  },

  async update(id: number, data: TaskUpdate): Promise<Task> {
    return api.put<Task>(`/tasks/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/tasks/${id}`);
  },

  async complete(id: number): Promise<Task> {
    return api.post<Task>(`/tasks/${id}/complete`, {});
  },

  async setNextAction(id: number): Promise<Task> {
    return api.post<Task>(`/tasks/${id}/next-action`, {});
  },

  async toggleComplete(id: number): Promise<Task> {
    return api.post<Task>(`/tasks/${id}/toggle-complete`, {});
  },

  async getNextActions(): Promise<Task[]> {
    return api.get<Task[]>('/tasks/next-actions');
  }
};
```

## Done When

- All methods implemented and typed correctly
- Methods make calls to `/api/v1/tasks/*` endpoints
- Filters properly formatted as query parameters

## Effort

M (2 hours)

## Depends On

L2-05, L1-04
