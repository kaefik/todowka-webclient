'use client';

import { useNextActions, useCompleteTask } from '@/lib/hooks/useTasks';
import { TaskList } from '@/components/task/TaskList';

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
