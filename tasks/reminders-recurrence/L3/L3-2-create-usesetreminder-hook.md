# [L3-2] Create useSetReminder Hook

## Status
[ ] Pending

## Goal
React Query hook for setting task reminders.

## Input
- Extended tasksAPI from L3-1

## Output
`src/lib/hooks/useTaskReminder.ts` with useSetReminder hook.

## Done when
- Hook returns mutation
- Mutation calls setReminder API
- Query cache is invalidated on success
- Hook is properly typed

## Implementation Details

### File Structure

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '@/lib/api/tasks';

export function useSetReminder() {
  // Implementation
}
```

### Hook Implementation

```typescript
export function useSetReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reminderTime, enabled }: { id: number; reminderTime: string | null; enabled: boolean }) =>
      tasksAPI.setReminder(id, reminderTime, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });
}
```

### Mutation Parameters

- `id`: Task ID
- `reminderTime`: ISO 8601 datetime string or null
- `enabled`: Boolean indicating if reminder is enabled

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
