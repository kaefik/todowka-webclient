# L8-47 — Create Tasks page (app/tasks/page.tsx)

## Goal

Implement tasks list with filters.

## Input

Task L5-27, L7-38, L5-28 completed.

## Output

`src/app/(dashboard)/tasks/page.tsx` with tasks page.

## Implementation

```typescript
'use client';

import { useState } from 'react';
import { useTasks } from '@/lib/hooks/useTasks';
import { TaskFilters } from '@/components/task/TaskFilters';
import { TaskList } from '@/components/task/TaskList';
import type { TaskFilters as TaskFiltersType } from '@/types';
import { useCompleteTask } from '@/lib/hooks/useTasks';
import { useSetNextAction } from '@/lib/hooks/useTasks';
import { useDeleteTask } from '@/lib/hooks/useTasks';

export default function TasksPage() {
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const { data: tasks } = useTasks(filters);
  const completeTask = useCompleteTask();
  const setNextAction = useSetNextAction();
  const deleteTask = useDeleteTask();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tasks</h1>

      <TaskFilters filters={filters} onFiltersChange={setFilters} />

      <TaskList
        tasks={tasks || []}
        onComplete={(id) => completeTask.mutate(id)}
        onNextAction={(id) => setNextAction.mutate(id)}
        onDelete={(id) => {
          if (confirm('Delete this task?')) {
            deleteTask.mutate(id);
          }
        }}
      />
    </div>
  );
}
```

## Done When

- Displays filtered tasks
- Filters work
- All actions work

## Effort

L (4 hours)

## Depends On

L5-27, L7-38, L5-28
