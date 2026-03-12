# L2-08 — Create inbox API module

## Goal

Implement inbox API integration.

## Input

Task L2-05 completed, L1-04 completed.

## Output

`src/lib/api/inbox.ts` with inboxAPI object.

## Implementation

```typescript
import { TodoAPIClient } from './client';
import type { Task, InboxCreate } from '@/types';

const api = new TodoAPIClient();

export const inboxAPI = {
  async getAll(): Promise<Task[]> {
    return api.get<Task[]>('/inbox');
  },

  async create(data: InboxCreate): Promise<Task> {
    return api.post<Task>('/inbox', data);
  }
};
```

## Done When

- `getAll()` fetches inbox tasks
- `create()` creates task via `/api/v1/inbox`

## Effort

S (1 hour)

## Depends On

L2-05, L1-04
