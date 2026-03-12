# L7-40 — Create useInbox hook

## Goal

Implement React Query hooks for inbox.

## Input

Task L2-08 completed, Task L3-16 completed.

## Output

`src/lib/hooks/useInbox.ts` with useInbox and useCreateInboxTask hooks.

## Implementation

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inboxAPI } from '@/lib/api/inbox';
import type { InboxCreate } from '@/types';

export function useInbox() {
  return useQuery({
    queryKey: ['inbox'],
    queryFn: () => inboxAPI.getAll(),
  });
}

export function useCreateInboxTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InboxCreate) => inboxAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

## Done When

- Hooks fetch/mutate inbox data correctly
- Queries invalidate on create

## Effort

M (2 hours)

## Depends On

L2-08, L3-16
