# [L3-3] Create useSetRecurrence Hook

## Status
[ ] Pending

## Goal
React Query hook for setting task recurrence.

## Input
- Extended tasksAPI from L3-1

## Output
`src/lib/hooks/useTaskRecurrence.ts` with useSetRecurrence hook.

## Done when
- Hook returns mutation
- Mutation calls setRecurrence API
- Query cache is invalidated on success
- Hook is properly typed

## Implementation Details

### File Structure

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '@/lib/api/tasks';
import type { RecurrenceType, RecurrenceConfig } from '@/types';

export function useSetRecurrence() {
  // Implementation
}
```

### Hook Implementation

```typescript
export function useSetRecurrence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, type, config }: { id: number; type: RecurrenceType | null; config: RecurrenceConfig | null }) =>
      tasksAPI.setRecurrence(id, type, config),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });
}
```

### Mutation Parameters

- `id`: Task ID
- `type`: RecurrenceType ('none', 'daily', 'weekly', 'monthly', 'yearly') or null
- `config`: RecurrenceConfig object with optional days_of_week and day_of_month

### On Success

Invalidate `['tasks']` query to refresh task list.

## Validation

Run these commands after implementation:

```bash
npm run typecheck
npm run lint
```

## Dependencies
- L3-1: Extended tasksAPI

## Estimated Time
1 hour
