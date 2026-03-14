'use client';

import { useParams } from 'next/navigation';
import { useProject } from '@/lib/hooks/useProjects';
import { useTasks, useCreateTask, useCompleteTask, useUpdateTask, useDeleteTask, useSetNextAction } from '@/lib/hooks/useTasks';
import { useQueryClient } from '@tanstack/react-query';
import { ProjectCard } from '@/components/project/ProjectCard';
import { TaskList } from '@/components/task/TaskList';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/task/TaskForm';
import { Button } from '@/components/ui/Button';
import { useState, useMemo } from 'react';
import type { TaskCreate, TaskUpdate, Task } from '@/types';
import { useContexts } from '@/lib/hooks/useContexts';
import { useTags } from '@/lib/hooks/useTags';

type TaskFilter = 'next' | 'active' | 'all';

export default function ProjectDetailsPage() {
  const queryClient = useQueryClient();
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const { data: project } = useProject(projectId);
  const { data: projectTasks, isLoading } = useTasks({ project_id: projectId });
  const { data: contexts } = useContexts();
  const { data: tags } = useTags();

  const [filter, setFilter] = useState<TaskFilter>('active');
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const createTask = useCreateTask();
  const completeTask = useCompleteTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const setNextAction = useSetNextAction();

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleDeleteTask = (id: number) => {
    if (confirm('Delete this task?')) {
      deleteTask.mutate(id);
    }
  };

  const handleSaveTask = (data: TaskUpdate) => {
    if (editingTask) {
      updateTask.mutate(
        { id: editingTask.id, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['tasks', { project_id: projectId }] });
            queryClient.invalidateQueries({ queryKey: ['task', editingTask.id] });
          },
        }
      );
      setEditingTask(null);
    }
  };

  const filteredTasks = useMemo(() => {
    if (!projectTasks) return [];

    const tasks = Array.isArray(projectTasks) ? projectTasks : (projectTasks as any)?.items || [];

    switch (filter) {
      case 'next':
        return tasks.filter((t: any) => t.is_next_action && !t.completed);
      case 'active':
        return tasks.filter((t: any) => !t.completed).sort((a: any, b: any) => {
          if (a.is_next_action && !b.is_next_action) return -1;
          if (!a.is_next_action && b.is_next_action) return 1;
          return 0;
        });
      case 'all':
        return tasks.sort((a: any, b: any) => {
          if (a.completed && !b.completed) return 1;
          if (!a.completed && b.completed) return -1;
          if (a.is_next_action && !b.is_next_action) return -1;
          if (!a.is_next_action && b.is_next_action) return 1;
          return 0;
        });
      default:
        return tasks;
    }
  }, [projectTasks, filter]);

  return (
    <div className="space-y-6">
      {project && (
        <ProjectCard project={project} />
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button variant="primary" onClick={() => setIsCreatingTask(true)}>
          + Add Task
        </Button>
      </div>

      <div className="flex gap-2 border-b border-border">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === 'next' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setFilter('next')}
        >
          Next
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === 'active' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === 'all' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
      </div>

      <TaskList
        tasks={filteredTasks}
        loading={isLoading}
        onComplete={(id) => completeTask.mutate(id)}
        onNextAction={(id) => {
          const tasks = Array.isArray(projectTasks) ? projectTasks : (projectTasks as any)?.items || [];
          const task = tasks.find((t: Task) => t.id === id);
          const flag = task ? !task.is_next_action : true;
          setNextAction.mutate({ id, flag });
        }}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      <Modal isOpen={isCreatingTask} onClose={() => setIsCreatingTask(false)} title="Add Task">
        <TaskForm
          projects={project ? [project] : []}
          contexts={contexts || []}
          tags={tags || []}
          onSubmit={(data: TaskCreate | any) => {
            createTask.mutate({ ...data, project_id: projectId });
            setIsCreatingTask(false);
          }}
          onCancel={() => setIsCreatingTask(false)}
          isSubmitting={createTask.isPending}
        />
      </Modal>

      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task">
        {editingTask && (
          <TaskForm
            task={editingTask}
            projects={project ? [project] : []}
            contexts={contexts || []}
            tags={tags || []}
            onSubmit={handleSaveTask}
            onCancel={() => setEditingTask(null)}
            isSubmitting={updateTask.isPending}
          />
        )}
      </Modal>
    </div>
  );
}
