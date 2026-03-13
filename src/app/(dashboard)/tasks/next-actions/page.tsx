'use client';

import { useNextActions, useCompleteTask } from '@/lib/hooks/useTasks';
import { TaskList } from '@/components/task/TaskList';
import type { TaskListResponse } from '@/types';

export default function NextActionsPage() {
  const { data: nextActions, isLoading } = useNextActions();
  const completeTask = useCompleteTask();

  const taskList = Array.isArray(nextActions) ? nextActions : (nextActions as any)?.items || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Next Actions</h1>

      <TaskList
        tasks={taskList}
        loading={isLoading}
        onComplete={(id) => completeTask.mutate(id)}
      />
    </div>
  );
}
