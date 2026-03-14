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
  const [isProcessing, setIsProcessing] = useState(false);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const completeTask = useCompleteTask();

  const taskList = Array.isArray(tasks) ? tasks : (tasks as any)?.items || [];
  const projectList = Array.isArray(projects) ? projects : (projects as any)?.items || [];

  const handleClarify = (task: Task) => {
    setSelectedTask(task);
  };

  const handleProcessAll = () => {
    setIsProcessing(true);
    if (taskList.length > 0) {
      setSelectedTask(taskList[0]);
    }
  };

  const handleSave = (data: TaskUpdate) => {
    if (selectedTask) {
      updateTask.mutate({ id: selectedTask.id, data });
      if (isProcessing) {
        const currentIndex = taskList.findIndex((t: Task) => t.id === selectedTask.id);
        const nextTask = taskList[currentIndex + 1];
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

  const handleDelete = (id: number) => {
    if (confirm('Delete this task?')) {
      if (isProcessing && selectedTask?.id === id) {
        const currentIndex = taskList.findIndex((t: Task) => t.id === id);
        const nextTask = taskList[currentIndex + 1];
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
        <Button variant="primary" onClick={handleProcessAll} disabled={taskList.length === 0}>
          Process All
        </Button>
      </div>

      {isProcessing && selectedTask && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            Processing task {taskList.findIndex((t: Task) => t.id === selectedTask.id) + 1} of {taskList.length}
          </p>
        </div>
      )}

      <TaskList
        tasks={taskList}
        loading={isLoading}
        showNextButton={false}
        onComplete={(id) => {
          completeTask.mutate(id);
          if (isProcessing && selectedTask?.id === id) {
            const currentIndex = taskList.findIndex((t: Task) => t.id === id);
            const nextTask = taskList[currentIndex + 1];
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
      />

      <Modal
        isOpen={!!selectedTask}
        onClose={() => {
          setSelectedTask(null);
          setIsProcessing(false);
        }}
        title={isProcessing ? `Process task ${taskList.findIndex((t: Task) => t.id === selectedTask?.id) + 1} of ${taskList.length}` : 'Clarify Task'}
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
    </div>
  );
}
