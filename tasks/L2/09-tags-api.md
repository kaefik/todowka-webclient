# L2-09 — Create tags API module

## Goal

Implement tags API integration with full CRUD.

## Input

Task L2-05 completed, L1-04 completed.

## Output

`src/lib/api/tags.ts` with tagsAPI object.

## Implementation

```typescript
import { TodoAPIClient } from './client';
import type { Tag, TagCreate, TagUpdate } from '@/types';

const api = new TodoAPIClient();

export const tagsAPI = {
  async getAll(): Promise<Tag[]> {
    return api.get<Tag[]>('/tags');
  },

  async getById(id: number): Promise<Tag> {
    return api.get<Tag>(`/tags/${id}`);
  },

  async create(data: TagCreate): Promise<Tag> {
    return api.post<Tag>('/tags', data);
  },

  async update(id: number, data: TagUpdate): Promise<Tag> {
    return api.put<Tag>(`/tags/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/tags/${id}`);
  }
};
```

## Done When

- All CRUD methods implemented
- Methods call `/api/v1/tags/*` endpoints

## Effort

S (1 hour)

## Depends On

L2-05, L1-04
