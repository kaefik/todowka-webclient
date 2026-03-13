'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '@/lib/api/tasks';
import type { Task, TaskCreate, TaskUpdate, TaskFilters, TaskStatus } from '@/types';

export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksAPI.getAll(filters),
  });
}

export function useTask(id: number) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => tasksAPI.getById(id),
    enabled: !!id,
  });
}

export function useNextActions() {
  return useQuery({
    queryKey: ['nextActions'],
    queryFn: () => tasksAPI.getNextActions(),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskCreate) => tasksAPI.create(data),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        return [
          {
            ...newTask,
            id: Date.now(),
            status: newTask.status || 'inbox',
            priority: newTask.priority || 'medium',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tag_ids: newTask.tag_ids || [],
            is_next_action: false,
          } as Task,
          ...(old || []),
        ];
      });

      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      queryClient.setQueryData(['tasks'], (context as any)?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskUpdate }) =>
      tasksAPI.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        return (old || []).map(task =>
          task.id === id ? { ...task, ...data, updated_at: new Date().toISOString() } : task
        );
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['tasks'], (context as any)?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tasksAPI.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        return (old || []).filter(task => task.id !== id);
      });

      return { previousTasks };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['tasks'], (context as any)?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tasksAPI.complete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['nextActions'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      const previousNextActions = queryClient.getQueryData(['nextActions']);

      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        return (old || []).map(task =>
          task.id === id ? { ...task, status: 'completed' as TaskStatus, completed_at: new Date().toISOString() } : task
        );
      });

      return { previousTasks, previousNextActions };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['tasks'], (context as any)?.previousTasks);
      queryClient.setQueryData(['nextActions'], (context as any)?.previousNextActions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['nextActions'] });
    },
  });
}

export function useSetNextAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tasksAPI.setNextAction(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['nextActions'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      const previousNextActions = queryClient.getQueryData(['nextActions']);

      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        return (old || []).map(task =>
          task.id === id ? { ...task, is_next_action: true } : task
        );
      });

      return { previousTasks, previousNextActions };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['tasks'], (context as any)?.previousTasks);
      queryClient.setQueryData(['nextActions'], (context as any)?.previousNextActions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['nextActions'] });
    },
  });
}
