# [L3-4] Create useCompleteTask Hook

## Status
[ ] Pending

## Goal
React Query hook for completing tasks with recurrence support.

## Input
- Extended tasksAPI from L3-1

## Output
`src/lib/hooks/useCompleteTask.ts` with useCompleteTask hook.

## Done when
- Hook returns mutation
- Mutation calls complete API
- Query cache is invalidated on success
- nextTask is handled in onSuccess (optional toast notification)
- Hook is properly typed

## Implementation Details

### File Structure

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '@/lib/api/tasks';

export function useCompleteTask() {
  // Implementation
}
```

### Hook Implementation

```typescript
export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, skipRecurrence }: { id: number; skipRecurrence?: boolean }) =>
      tasksAPI.complete(id, skipRecurrence),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['tasks']);
      if (data.nextTask) {
        // Optional: show notification about next task creation
        // This can be implemented later with useToast
      }
    },
  });
}
```

### Mutation Parameters

- `id`: Task ID
- `skipRecurrence`: Optional boolean, if true skips creating next task for recurring tasks

### Response Type

```typescript
{
  task: Task;
  nextTask?: Task;
}
```

### On Success

1. Invalidate `['tasks']` query to refresh task list
2. Optionally handle `data.nextTask` to show notification about next task creation

### Future Enhancement

The optional toast notification for nextTask can be added later by integrating with the useToast hook from L1-2.

## Validation

Run these commands after implementation:

```bash
npm run typecheck
npm run lint
```

## Dependencies
- L3-1: Extended tasksAPI

## Estimated Time
2 hours
