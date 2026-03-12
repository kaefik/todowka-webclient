# L8-48 — Create Next Actions page (app/tasks/next-actions/page.tsx)

## Goal

Implement next actions view.

## Input

Task L5-27, L7-38 completed.

## Output

`src/app/(dashboard)/tasks/next-actions/page.tsx` with next actions page.

## Implementation

```typescript
'use client';

import { useNextActions } from '@/lib/hooks/useTasks';
import { TaskList } from '@/components/task/TaskList';
import { useCompleteTask } from '@/lib/hooks/useTasks';

export default function NextActionsPage() {
  const { data: nextActions } = useNextActions();
  const completeTask = useCompleteTask();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Next Actions</h1>

      <TaskList
        tasks={nextActions || []}
        onComplete={(id) => completeTask.mutate(id)}
      />
    </div>
  );
}
```

## Done When

- Displays tasks with `is_next_action: true`
- Complete works

## Effort

M (2 hours)

## Depends On

L5-27, L7-38
