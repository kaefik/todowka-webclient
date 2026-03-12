# L5-27 — Create TaskList component

## Goal

Implement task list container with empty state.

## Input

Task L5-26 completed.

## Output

`src/components/task/TaskList.tsx` with TaskList component.

## Implementation

```typescript
import type { Task } from '@/types';
import { TaskItem } from './TaskItem';
import { EmptyState } from '@/components/ui/EmptyState';

interface TaskListProps {
  tasks: Task[];
  onComplete?: (id: number) => void;
  onNextAction?: (id: number) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number) => void;
}

export function TaskList({ tasks, onComplete, onNextAction, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="Create a new task to get started"
        icon="📝"
      />
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onComplete={onComplete}
          onNextAction={onNextAction}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
```

## Done When

- Displays list of TaskItems
- Shows EmptyState when no tasks
- Keys correct for React list

## Effort

M (2 hours)

## Depends On

L5-26
