'use client';

import { useState, useMemo } from 'react';
import { useTasks, useCompleteTask, useSetNextAction, useDeleteTask, useUpdateTask, useSetWaiting } from '@/lib/hooks/useTasks';
import { useProjects } from '@/lib/hooks/useProjects';
import { useContexts } from '@/lib/hooks/useContexts';
import { useTags } from '@/lib/hooks/useTags';
import { TaskFilters } from '@/components/task/TaskFilters';
import { TaskList } from '@/components/task/TaskList';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/task/TaskForm';
import { WaitingModal } from '@/components/task/WaitingModal';
import type { TaskFilters as TaskFiltersType, TaskListResponse, Task, TaskUpdate } from '@/types';

export default function TasksPage() {
  const [filters, setFilters] = useState<TaskFiltersType>({ status: 'active' });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [waitingTask, setWaitingTask] = useState<Task | null>(null);
  const { data: tasks, isLoading } = useTasks(filters);
  const { data: projects } = useProjects();
  const { data: contexts } = useContexts();
  const { data: tags } = useTags();
  const completeTask = useCompleteTask();
  const setNextAction = useSetNextAction();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();
  const setWaiting = useSetWaiting();

  const taskList = Array.isArray(tasks) ? tasks : (tasks as any)?.items || [];
  const projectList = Array.isArray(projects) ? projects : (projects as any)?.items || [];

  const filteredTaskList = useMemo(() => {
    return filters.status === 'active'
      ? taskList.filter((t: Task) => !t.completed)
      : taskList;
  }, [taskList, filters.status]);

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
  };

  const handleSave = (data: TaskUpdate) => {
    if (selectedTask) {
      updateTask.mutate({ id: selectedTask.id, data });
      setSelectedTask(null);
    }
  };

  const handleWaiting = (task: Task) => {
    setWaitingTask(task);
  };

  const handleSetWaiting = (id: number, waitingFor: string) => {
    setWaiting.mutate({ id, waitingFor });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tasks</h1>

      <TaskFilters filters={filters} onFiltersChange={setFilters} />

      <TaskList
        tasks={filteredTaskList}
        loading={isLoading}
        onComplete={(id) => completeTask.mutate(id)}
        onNextAction={(id) => {
          const task = taskList.find((t: Task) => t.id === id);
          const flag = task ? !task.is_next_action : true;
          setNextAction.mutate({ id, flag });
        }}
        onEdit={handleEdit}
        onDelete={(id) => {
          if (confirm('Delete this task?')) {
            deleteTask.mutate(id);
          }
        }}
        onWaiting={handleWaiting}
        showWaitingButton={true}
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

      <WaitingModal
        isOpen={!!waitingTask}
        onClose={() => setWaitingTask(null)}
        task={waitingTask}
        onSubmit={handleSetWaiting}
        isSubmitting={setWaiting.isPending}
      />
    </div>
  );
}
