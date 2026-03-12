# L2-11 — Create areas API module

## Goal

Implement areas API integration with full CRUD.

## Input

Task L2-05 completed, L1-04 completed.

## Output

`src/lib/api/areas.ts` with areasAPI object.

## Implementation

```typescript
import { TodoAPIClient } from './client';
import type { Area, AreaCreate, AreaUpdate } from '@/types';

const api = new TodoAPIClient();

export const areasAPI = {
  async getAll(): Promise<Area[]> {
    return api.get<Area[]>('/areas');
  },

  async getById(id: number): Promise<Area> {
    return api.get<Area>(`/areas/${id}`);
  },

  async create(data: AreaCreate): Promise<Area> {
    return api.post<Area>('/areas', data);
  },

  async update(id: number, data: AreaUpdate): Promise<Area> {
    return api.put<Area>(`/areas/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/areas/${id}`);
  }
};
```

## Done When

- All CRUD methods implemented
- Methods call `/api/v1/areas/*` endpoints

## Effort

S (1 hour)

## Depends On

L2-05, L1-04
