'use client';

import { useInbox } from '@/lib/hooks/useInbox';
import { useTasks, useUpdateTask, useDeleteTask, useCompleteTask, useSetWaiting } from '@/lib/hooks/useTasks';
import { useProjects } from '@/lib/hooks/useProjects';
import { useContexts } from '@/lib/hooks/useContexts';
import { useTags } from '@/lib/hooks/useTags';
import { TaskList } from '@/components/task/TaskList';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/task/TaskForm';
import { QuickCapture } from '@/components/layout/QuickCapture';
import { WaitingModal } from '@/components/task/WaitingModal';
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
  const [waitingTask, setWaitingTask] = useState<Task | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const completeTask = useCompleteTask();
  const setWaiting = useSetWaiting();

  const taskList = Array.isArray(tasks) ? tasks : (tasks as any)?.items || [];
  const projectList = Array.isArray(projects) ? projects : (projects as any)?.items || [];

  const activeTaskList = taskList.filter((t: Task) => !t.completed);

  const handleClarify = (task: Task) => {
    setSelectedTask(task);
  };

  const handleProcessAll = () => {
    setIsProcessing(true);
    if (activeTaskList.length > 0) {
      setSelectedTask(activeTaskList[0]);
    }
  };

  const handleSave = (data: TaskUpdate) => {
    if (selectedTask) {
      updateTask.mutate({ id: selectedTask.id, data });
      if (isProcessing) {
        const currentIndex = activeTaskList.findIndex((t: Task) => t.id === selectedTask.id);
        const nextTask = activeTaskList[currentIndex + 1];
        if (nextTask) {
          setSelectedTask(nextTask);
        } else {
          setIsProcessing(false);
          setSelectedTask(null);
        }
      } else {
        setSelectedTask(null);
      }
    }
  };

  const handleWaiting = (task: Task) => {
    setWaitingTask(task);
  };

  const handleSetWaiting = (id: number, waitingFor: string) => {
    setWaiting.mutate({ id, waitingFor });
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this task?')) {
      if (isProcessing && selectedTask?.id === id) {
        const currentIndex = activeTaskList.findIndex((t: Task) => t.id === id);
        const nextTask = activeTaskList[currentIndex + 1];
        if (nextTask) {
          setSelectedTask(nextTask);
        } else {
          setIsProcessing(false);
          setSelectedTask(null);
        }
      }
      deleteTask.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <Button variant="primary" onClick={handleProcessAll} disabled={activeTaskList.length === 0}>
          Process All
        </Button>
      </div>

      <section>
        <QuickCapture />
      </section>

      {isProcessing && selectedTask && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            Processing task {activeTaskList.findIndex((t: Task) => t.id === selectedTask.id) + 1} of {activeTaskList.length}
          </p>
        </div>
      )}

      <TaskList
        tasks={activeTaskList}
        loading={isLoading}
        showNextButton={false}
        showWaitingButton={true}
        onComplete={(id) => {
          completeTask.mutate(id);
          if (isProcessing && selectedTask?.id === id) {
            const currentIndex = activeTaskList.findIndex((t: Task) => t.id === id);
            const nextTask = activeTaskList[currentIndex + 1];
            if (nextTask) {
              setSelectedTask(nextTask);
            } else {
              setIsProcessing(false);
              setSelectedTask(null);
            }
          }
        }}
        onEdit={handleClarify}
        onDelete={handleDelete}
        onWaiting={handleWaiting}
      />

      <Modal
        isOpen={!!selectedTask}
        onClose={() => {
          setSelectedTask(null);
          setIsProcessing(false);
        }}
        title={isProcessing ? `Process task ${activeTaskList.findIndex((t: Task) => t.id === selectedTask?.id) + 1} of ${activeTaskList.length}` : 'Clarify Task'}
      >
        {selectedTask && (
          <TaskForm
            key={selectedTask.id}
            task={selectedTask}
            projects={projectList}
            contexts={contexts || []}
            tags={tags || []}
            onSubmit={handleSave}
            onCancel={() => {
              setSelectedTask(null);
              setIsProcessing(false);
            }}
            isSubmitting={updateTask.isPending}
            moveToActive={isProcessing}
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
