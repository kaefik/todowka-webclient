'use client';

import { useState } from 'react';
import { useTasks, useCompleteTask, useSetNextAction, useDeleteTask, useUpdateTask } from '@/lib/hooks/useTasks';
import { useProjects } from '@/lib/hooks/useProjects';
import { useContexts } from '@/lib/hooks/useContexts';
import { useTags } from '@/lib/hooks/useTags';
import { TaskFilters } from '@/components/task/TaskFilters';
import { TaskList } from '@/components/task/TaskList';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/task/TaskForm';
import type { TaskFilters as TaskFiltersType, TaskListResponse, Task, TaskUpdate } from '@/types';

export default function TasksPage() {
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { data: tasks, isLoading } = useTasks(filters);
  const { data: projects } = useProjects();
  const { data: contexts } = useContexts();
  const { data: tags } = useTags();
  const completeTask = useCompleteTask();
  const setNextAction = useSetNextAction();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const taskList = Array.isArray(tasks) ? tasks : (tasks as any)?.items || [];
  const projectList = Array.isArray(projects) ? projects : (projects as any)?.items || [];

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
  };

  const handleSave = (data: TaskUpdate) => {
    if (selectedTask) {
      updateTask.mutate({ id: selectedTask.id, data });
      setSelectedTask(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tasks</h1>

      <TaskFilters filters={filters} onFiltersChange={setFilters} />

      <TaskList
        tasks={taskList}
        loading={isLoading}
        onComplete={(id) => completeTask.mutate(id)}
        onNextAction={(id) => setNextAction.mutate(id)}
        onEdit={handleEdit}
        onDelete={(id) => {
          if (confirm('Delete this task?')) {
            deleteTask.mutate(id);
          }
        }}
      />

      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Edit Task">
        {selectedTask && (
          <TaskForm
            task={selectedTask}
            projects={projectList}
            contexts={contexts || []}
            tags={tags || []}
            onSubmit={handleSave}
            onCancel={() => setSelectedTask(null)}
            isSubmitting={updateTask.isPending}
          />
        )}
      </Modal>
    </div>
  );
}
