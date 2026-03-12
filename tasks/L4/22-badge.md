# L4-22 — Create Badge component

## Goal

Implement status/priority badge component with variants.

## Input

Task L0-02 completed, Task L1-04 completed.

## Output

`src/components/ui/Badge.tsx` with Badge component.

## Implementation

```typescript
import type { TaskStatus, TaskPriority } from '@/types';

interface BadgeProps {
  variant?: 'status' | 'priority';
  value?: TaskStatus | TaskPriority;
  children?: React.ReactNode;
  className?: string;
}

const statusColors: Record<TaskStatus, string> = {
  inbox: 'bg-status-inbox text-white',
  active: 'bg-status-active text-white',
  completed: 'bg-status-completed text-white',
  waiting: 'bg-status-waiting text-white',
  someday: 'bg-status-someday text-white',
};

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-priority-low text-white',
  medium: 'bg-priority-medium text-white',
  high: 'bg-priority-high text-white',
};

export function Badge({ variant = 'status', value, children, className = '' }: BadgeProps) {
  const colorClass = variant === 'status' && value
    ? statusColors[value as TaskStatus]
    : variant === 'priority' && value
    ? priorityColors[value as TaskPriority]
    : 'bg-gray-200 text-gray-700';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {children || value}
    </span>
  );
}
```

## Done When

- Badges display with correct colors per design
- Status variants work: inbox, active, completed, waiting, someday
- Priority variants work: low, medium, high

## Effort

S (1 hour)

## Depends On

L0-02, L1-04
