'use client';

import { useState } from 'react';
import { useTasks, useCompleteTask, useSetNextAction, useDeleteTask } from '@/lib/hooks/useTasks';
import { TaskFilters } from '@/components/task/TaskFilters';
import { TaskList } from '@/components/task/TaskList';
import type { TaskFilters as TaskFiltersType } from '@/types';

export default function TasksPage() {
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const { data: tasks, isLoading } = useTasks(filters);
  const completeTask = useCompleteTask();
  const setNextAction = useSetNextAction();
  const deleteTask = useDeleteTask();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tasks</h1>

      <TaskFilters filters={filters} onFiltersChange={setFilters} />

      <TaskList
        tasks={tasks || []}
        loading={isLoading}
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
