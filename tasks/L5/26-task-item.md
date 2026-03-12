# L5-26 — Create TaskItem component

## Goal

Implement single task display component with actions.

## Input

Task L4-22 completed, Task L1-04 completed.

## Output

`src/components/task/TaskItem.tsx` with TaskItem component.

## Implementation

```typescript
'use client';

import type { Task } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface TaskItemProps {
  task: Task;
  onComplete?: (id: number) => void;
  onNextAction?: (id: number) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number) => void;
}

export function TaskItem({ task, onComplete, onNextAction, onEdit, onDelete }: TaskItemProps) {
  return (
    <div className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </h3>
            <Badge variant="status" value={task.status} />
            <Badge variant="priority" value={task.priority} />
          </div>
          {task.description && (
            <p className="text-sm text-foreground-secondary mb-2">{task.description}</p>
          )}
          {task.is_next_action && (
            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              Next Action
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit?.(task)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onNextAction?.(task.id)}>
            Next
          </Button>
          <Button variant="primary" size="sm" onClick={() => onComplete?.(task.id)}>
            ✓
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete?.(task.id)}>
            ✕
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## Done When

- Displays task info (title, description, status, priority)
- Action buttons work (Complete, Next Action, Edit, Delete)
- Strikethrough on completed tasks
- Next Action badge displays when applicable

## Effort

M (2 hours)

## Depends On

L4-22, L1-04
