'use client';

import { useState } from 'react';
import { useNextActions, useCompleteTask, useUpdateTask, useDeleteTask } from '@/lib/hooks/useTasks';
import { useProjects } from '@/lib/hooks/useProjects';
import { useContexts } from '@/lib/hooks/useContexts';
import { useTags } from '@/lib/hooks/useTags';
import { TaskList } from '@/components/task/TaskList';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/task/TaskForm';
import type { Task, TaskUpdate, TaskListResponse } from '@/types';

export default function NextActionsPage() {
  const { data: nextActions, isLoading } = useNextActions();
  const completeTask = useCompleteTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { data: projects } = useProjects();
  const { data: contexts } = useContexts();
  const { data: tags } = useTags();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const taskList = Array.isArray(nextActions) ? nextActions : (nextActions as any)?.items || [];
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

  const handleDelete = (id: number) => {
    if (confirm('Delete this task?')) {
      deleteTask.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Next Actions</h1>

      <TaskList
        tasks={taskList}
        loading={isLoading}
        onComplete={(id) => completeTask.mutate(id)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Edit Task">
        {selectedTask && (
          <TaskForm
            key={selectedTask.id}
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
