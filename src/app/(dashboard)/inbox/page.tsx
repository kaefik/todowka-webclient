'use client';

import { useInbox } from '@/lib/hooks/useInbox';
import { useTasks, useUpdateTask, useDeleteTask, useCompleteTask } from '@/lib/hooks/useTasks';
import { useProjects } from '@/lib/hooks/useProjects';
import { useContexts } from '@/lib/hooks/useContexts';
import { useTags } from '@/lib/hooks/useTags';
import { TaskList } from '@/components/task/TaskList';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/task/TaskForm';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import type { Task, TaskUpdate, TaskListResponse } from '@/types';

export default function InboxPage() {
  const { data: tasks, isLoading } = useInbox();
  const { data: allTasks } = useTasks({ status: 'active' });
  const { data: projects } = useProjects();
  const { data: contexts } = useContexts();
  const { data: tags } = useTags();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const completeTask = useCompleteTask();

  const taskList = Array.isArray(tasks) ? tasks : (tasks as any)?.items || [];
  const projectList = Array.isArray(projects) ? projects : (projects as any)?.items || [];

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
        tasks={taskList}
        loading={isLoading}
        onComplete={(id) => completeTask.mutate(id)}
        onEdit={handleClarify}
        onDelete={handleDelete}
      />

      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Clarify Task">
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
