'use client';

import { useState, useMemo } from 'react';
import { useTasks, useCompleteTask, useDeleteTask, useUpdateTask } from '@/lib/hooks/useTasks';
import { useProjects } from '@/lib/hooks/useProjects';
import { useContexts } from '@/lib/hooks/useContexts';
import { useTags } from '@/lib/hooks/useTags';
import { TaskList } from '@/components/task/TaskList';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/task/TaskForm';
import type { Task, TaskUpdate } from '@/types';

export default function CompletedPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { data: allTasks, isLoading } = useTasks({});
  const { data: projects } = useProjects();
  const { data: contexts } = useContexts();
  const { data: tags } = useTags();
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const taskList = Array.isArray(allTasks) ? allTasks : (allTasks as any)?.items || [];
  const projectList = Array.isArray(projects) ? projects : (projects as any)?.items || [];

  const completedTasks = useMemo(() => {
    return taskList.filter((t: Task) => t.completed);
  }, [taskList]);

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
      <h1 className="text-2xl font-bold">Completed Tasks</h1>

      <TaskList
        tasks={completedTasks}
        loading={isLoading}
        showNextButton={false}
        onComplete={(id) => completeTask.mutate(id)}
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
