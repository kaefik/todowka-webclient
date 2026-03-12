# L8-46 — Create Inbox page (app/inbox/page.tsx)

## Goal

Implement inbox processing page with quick actions.

## Input

Task L5-27, L7-40, L5-29 completed.

## Output

`src/app/(dashboard)/inbox/page.tsx` with inbox page.

## Implementation

```typescript
'use client';

import { useInbox } from '@/lib/hooks/useInbox';
import { TaskList } from '@/components/task/TaskList';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/task/TaskForm';
import { useTasks } from '@/lib/hooks/useTasks';
import { useProjects } from '@/lib/hooks/useProjects';
import { useContexts } from '@/lib/hooks/useContexts';
import { useTags } from '@/lib/hooks/useTags';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import type { Task, TaskUpdate } from '@/types';
import { useUpdateTask } from '@/lib/hooks/useTasks';
import { useDeleteTask } from '@/lib/hooks/useTasks';

export default function InboxPage() {
  const { data: tasks } = useInbox();
  const { data: allTasks } = useTasks({ status: 'active' });
  const { data: projects } = useProjects();
  const { data: contexts } = useContexts();
  const { data: tags } = useTags();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleClarify = (task: Task) => {
    setSelectedTask(task);
  };

  const handleSave = (data: TaskUpdate) => {
    if (selectedTask) {
      updateTask.mutate({ id: selectedTask.id, data });
      setSelectedTask(null);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this task?')) {
      deleteTask.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <Button variant="primary">Process All</Button>
      </div>

      <TaskList
        tasks={tasks || []}
        onComplete={() => {}}
        onEdit={handleClarify}
        onDelete={handleDelete}
      />

      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Clarify Task">
        {selectedTask && (
          <TaskForm
            task={selectedTask}
            projects={projects?.items || []}
            contexts={contexts || []}
            tags={tags || []}
            onSubmit={handleSave}
            onCancel={() => setSelectedTask(null)}
          />
        )}
      </Modal>
    </div>
  );
}
```

## Done When

- Displays inbox tasks
- Clarifying opens TaskForm modal
- Delete works with confirmation

## Effort

L (4 hours)

## Depends On

L5-27, L7-40, L5-29
