# L2-10 — Create contexts API module

## Goal

Implement contexts API integration with full CRUD.

## Input

Task L2-05 completed, L1-04 completed.

## Output

`src/lib/api/contexts.ts` with contextsAPI object.

## Implementation

```typescript
import { TodoAPIClient } from './client';
import type { Context, ContextCreate, ContextUpdate } from '@/types';

const api = new TodoAPIClient();

export const contextsAPI = {
  async getAll(): Promise<Context[]> {
    return api.get<Context[]>('/contexts');
  },

  async getById(id: number): Promise<Context> {
    return api.get<Context>(`/contexts/${id}`);
  },

  async create(data: ContextCreate): Promise<Context> {
    return api.post<Context>('/contexts', data);
  },

  async update(id: number, data: ContextUpdate): Promise<Context> {
    return api.put<Context>(`/contexts/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/contexts/${id}`);
  }
};
```

## Done When

- All CRUD methods implemented
- Methods call `/api/v1/contexts/*` endpoints

## Effort

S (1 hour)

## Depends On

L2-05, L1-04
