# L5-28 — Create TaskFilters component

## Goal

Implement task filter controls with status tabs and dropdowns.

## Input

Task L4-19, L4-20, L4-22 completed, Task L1-04 completed.

## Output

`src/components/task/TaskFilters.tsx` with TaskFilters component.

## Implementation

```typescript
'use client';

import { useState } from 'react';
import type { TaskFilters as TaskFiltersType, TaskStatus, TaskPriority } from '@/types';
import { Select, SelectItem } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
}

export function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  const [status, setStatus] = useState<TaskStatus | undefined>(filters.status);
  const [priority, setPriority] = useState<TaskPriority | undefined>(filters.priority);

  const statuses: TaskStatus[] = ['inbox', 'active', 'waiting', 'someday', 'completed'];
  const priorities: TaskPriority[] = ['low', 'medium', 'high'];

  return (
    <div className="p-4 border-b border-border bg-white">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Status Tabs */}
        <div className="flex gap-2">
          <button
            className={`px-3 py-1.5 rounded-md transition-colors ${
              !status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => {
              setStatus(undefined);
              onFiltersChange({ ...filters, status: undefined });
            }}
          >
            All
          </button>
          {statuses.map((s) => (
            <button
              key={s}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                status === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => {
                setStatus(s);
                onFiltersChange({ ...filters, status: s });
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <Select
          value={priority || ''}
          onChange={(value) => {
            const newPriority = value ? (value as TaskPriority) : undefined;
            setPriority(newPriority);
            onFiltersChange({ ...filters, priority: newPriority });
          }}
          placeholder="Priority"
        >
          <SelectItem value="">All Priorities</SelectItem>
          {priorities.map((p) => (
            <SelectItem key={p} value={p}>
              <Badge variant="priority" value={p} />
            </SelectItem>
          ))}
        </Select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search tasks..."
          className="px-3 py-1.5 border border-border rounded-md"
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        />
      </div>
    </div>
  );
}
```

## Done When

- Status tabs work and toggle correctly
- Priority dropdown selects
- Search input filters tasks
- Filters update parent state

## Effort

S (1 hour)

## Depends On

L4-19, L4-20, L4-22, L1-04
