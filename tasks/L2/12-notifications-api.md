# L2-12 — Create notifications API module

## Goal

Implement notifications API integration with full CRUD.

## Input

Task L2-05 completed, L1-04 completed.

## Output

`src/lib/api/notifications.ts` with notificationsAPI object.

## Implementation

```typescript
import { TodoAPIClient } from './client';
import type { Notification } from '@/types';

const api = new TodoAPIClient();

export const notificationsAPI = {
  async getAll(): Promise<Notification[]> {
    return api.get<Notification[]>('/notifications');
  },

  async getById(id: number): Promise<Notification> {
    return api.get<Notification>(`/notifications/${id}`);
  },

  async update(id: number, data: any): Promise<Notification> {
    return api.put<Notification>(`/notifications/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/notifications/${id}`);
  }
};
```

## Done When

- All CRUD methods implemented
- Methods call `/api/v1/notifications/*` endpoints

## Effort

S (1 hour)

## Depends On

L2-05, L1-04
