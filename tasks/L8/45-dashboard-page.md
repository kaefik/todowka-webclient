# L8-45 — Create Dashboard page (app/page.tsx)

## Goal

Implement dashboard with quick capture, counters, next actions, projects.

## Input

Task L6-37, L7-38, L7-39, L3-13, L3-15 completed.

## Output

`src/app/page.tsx` with dashboard page.

## Implementation

```typescript
'use client';

import { useInbox, useNextActions } from '@/lib/hooks/useTasks';
import { useProjects } from '@/lib/hooks/useProjects';
import { QuickCapture } from '@/components/layout/QuickCapture';
import { TaskList } from '@/components/task/TaskList';
import { ProjectList } from '@/components/project/ProjectList';
import { useCompleteTask } from '@/lib/hooks/useTasks';
import { useSetNextAction } from '@/lib/hooks/useTasks';
import type { Task } from '@/types';

export default function Dashboard() {
  const { data: inboxTasks } = useInbox();
  const { data: nextActions } = useNextActions();
  const { data: projects } = useProjects(1, 10);
  const completeTask = useCompleteTask();
  const setNextAction = useSetNextAction();

  const handleComplete = (id: number) => {
    completeTask.mutate(id);
  };

  const handleNextAction = (id: number) => {
    setNextAction.mutate(id);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Quick Capture */}
      <section>
        <QuickCapture />
      </section>

      {/* Counters */}
      <section className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-border rounded-lg">
          <div className="text-3xl font-bold text-blue-600">
            {inboxTasks?.length || 0}
          </div>
          <div className="text-sm text-foreground-secondary">Inbox</div>
        </div>
        <div className="p-4 bg-white border border-border rounded-lg">
          <div className="text-3xl font-bold text-green-600">
            {nextActions?.length || 0}
          </div>
          <div className="text-sm text-foreground-secondary">Next Actions</div>
        </div>
        <div className="p-4 bg-white border border-border rounded-lg">
          <div className="text-3xl font-bold text-purple-600">
            {projects?.items?.filter(p => p.status === 'active').length || 0}
          </div>
          <div className="text-sm text-foreground-secondary">Active Projects</div>
        </div>
      </section>

      {/* Next Actions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next Actions</h2>
        <TaskList
          tasks={nextActions?.slice(0, 5) || []}
          onComplete={handleComplete}
          onNextAction={handleNextAction}
        />
      </section>

      {/* Active Projects */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
        <ProjectList
          projects={projects?.items?.filter(p => p.status === 'active') || []}
        />
      </section>
    </div>
  );
}
```

## Done When

- Dashboard displays all widgets
- Quick capture creates tasks
- Counters show correct numbers
- Lists display next actions and projects

## Effort

L (4 hours)

## Depends On

L6-37, L7-38, L7-39, L3-13, L3-15
