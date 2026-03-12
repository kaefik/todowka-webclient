# L5-30 — Create ProjectCard component

## Goal

Implement project display card with progress bar.

## Input

Task L4-22 completed, Task L1-04 completed.

## Output

`src/components/project/ProjectCard.tsx` with ProjectCard component.

## Implementation

```typescript
'use client';

import type { Project } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from './ProgressBar';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: number) => void;
  onComplete?: (id: number) => void;
}

export function ProjectCard({ project, onEdit, onDelete, onComplete }: ProjectCardProps) {
  return (
    <div className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <Badge variant="status" value={project.status as any} />
          </div>
          {project.description && (
            <p className="text-sm text-foreground-secondary">{project.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit?.(project)}>
            Edit
          </Button>
          <Button variant="primary" size="sm" onClick={() => onComplete?.(project.id)}>
            ✓
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete?.(project.id)}>
            ✕
          </Button>
        </div>
      </div>

      <ProgressBar progress={project.progress} />

      <div className="mt-2 text-sm text-foreground-secondary">
        {project.completed_tasks} / {project.total_tasks} tasks
      </div>
    </div>
  );
}
```

## Done When

- Displays project info (name, description, status)
- Progress bar shows percentage
- Action buttons work (Complete, Edit, Delete)
- Task count displays

## Effort

M (2 hours)

## Depends On

L4-22, L1-04
