'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '@/lib/api/tasks';
import type { Task, TaskCreate, TaskUpdate, TaskFilters, TaskStatus, TaskListResponse } from '@/types';

export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => {
      console.log('[useTasks] Fetching tasks with filters:', filters);
      const result = tasksAPI.getAll(filters);
      result.then(data => console.log('[useTasks] Fetched tasks:', data));
      return result;
    },
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
      const previousTasks = queryClient.getQueryData<TaskListResponse>(['tasks']);

      queryClient.setQueryData(['tasks'], (old: TaskListResponse | undefined) => {
        const newTaskItem = {
          ...newTask,
          id: Date.now(),
          status: newTask.status || 'inbox',
          priority: newTask.priority || 'medium',
          completed: false,
          someday: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tag_ids: newTask.tag_ids || [],
          is_next_action: false,
          tags: [],
        } as Task;

        if (old && 'items' in old) {
          return { ...old, items: [newTaskItem, ...old.items] };
        }
        return [newTaskItem, ...(old || [])];
      });

      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      queryClient.setQueryData(['tasks'], (context as any)?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'tasks' });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskUpdate }) => {
      console.log('[useUpdateTask] Calling API with id:', id, 'data:', data);
      return tasksAPI.update(id, data);
    },
    onMutate: async ({ id, data }) => {
      console.log('[useUpdateTask] onMutate - id:', id, 'data:', data);
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['inbox'] });
      await queryClient.cancelQueries({ queryKey: ['nextActions'] });
      const previousTasks = queryClient.getQueryData<TaskListResponse>(['tasks']);
      const previousInbox = queryClient.getQueryData<TaskListResponse>(['inbox']);
      const previousNextActions = queryClient.getQueryData<TaskListResponse>(['nextActions']);

      queryClient.setQueryData(['tasks'], (old: TaskListResponse | undefined) => {
        if (old && 'items' in old) {
          return {
            ...old,
            items: old.items.map((task: Task) =>
              task.id === id ? {
                ...task,
                ...data,
                updated_at: new Date().toISOString(),
                project_id: 'project_id' in data ? data.project_id : task.project_id,
                context_id: 'context_id' in data ? data.context_id : task.context_id,
              } : task
            ),
          };
        }
        return (old || []).map((task: Task) =>
          task.id === id ? {
            ...task,
            ...data,
            updated_at: new Date().toISOString(),
            project_id: 'project_id' in data ? data.project_id : task.project_id,
            context_id: 'context_id' in data ? data.context_id : task.context_id,
          } : task
        );
      });

      queryClient.setQueryData(['inbox'], (old: TaskListResponse | undefined) => {
        if (old && 'items' in old) {
          return {
            ...old,
            items: old.items.map((task: Task) =>
              task.id === id ? {
                ...task,
                ...data,
                updated_at: new Date().toISOString(),
                project_id: 'project_id' in data ? data.project_id : task.project_id,
                context_id: 'context_id' in data ? data.context_id : task.context_id,
              } : task
            ),
          };
        }
        return (old || []).map((task: Task) =>
          task.id === id ? {
            ...task,
            ...data,
            updated_at: new Date().toISOString(),
            project_id: 'project_id' in data ? data.project_id : task.project_id,
            context_id: 'context_id' in data ? data.context_id : task.context_id,
          } : task
        );
      });

      queryClient.setQueryData(['nextActions'], (old: TaskListResponse | undefined) => {
        if (old && 'items' in old) {
          return {
            ...old,
            items: old.items.map((task: Task) =>
              task.id === id ? {
                ...task,
                ...data,
                updated_at: new Date().toISOString(),
                project_id: 'project_id' in data ? data.project_id : task.project_id,
                context_id: 'context_id' in data ? data.context_id : task.context_id,
              } : task
            ),
          };
        }
        return (old || []).map((task: Task) =>
          task.id === id ? {
            ...task,
            ...data,
            updated_at: new Date().toISOString(),
            project_id: 'project_id' in data ? data.project_id : task.project_id,
            context_id: 'context_id' in data ? data.context_id : task.context_id,
          } : task
        );
      });

      return { previousTasks, previousInbox, previousNextActions };
    },
    onSuccess: (result) => {
      console.log('[useUpdateTask] onSuccess - result:', result);
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'tasks' });
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      queryClient.invalidateQueries({ queryKey: ['nextActions'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (err, variables, context) => {
      console.error('[useUpdateTask] onError:', err);
      queryClient.setQueryData(['tasks'], (context as any)?.previousTasks);
      queryClient.setQueryData(['inbox'], (context as any)?.previousInbox);
      queryClient.setQueryData(['nextActions'], (context as any)?.previousNextActions);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tasksAPI.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<TaskListResponse>(['tasks']);

      queryClient.setQueryData(['tasks'], (old: TaskListResponse | undefined) => {
        if (old && 'items' in old) {
          return { ...old, items: old.items.filter((task: Task) => task.id !== id) };
        }
        return (old || []).filter((task: Task) => task.id !== id);
      });

      return { previousTasks };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['tasks'], (context as any)?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'tasks' });
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      queryClient.invalidateQueries({ queryKey: ['deletedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
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
      await queryClient.cancelQueries({ queryKey: ['inbox'] });
      const previousTasks = queryClient.getQueryData<TaskListResponse>(['tasks']);
      const previousNextActions = queryClient.getQueryData<TaskListResponse>(['nextActions']);
      const previousInbox = queryClient.getQueryData<TaskListResponse>(['inbox']);

      queryClient.setQueryData(['tasks'], (old: TaskListResponse | undefined) => {
        if (old && 'items' in old) {
          return {
            ...old,
            items: old.items.map((task: Task) =>
              task.id === id ? { ...task, completed: true, status: 'completed', updated_at: new Date().toISOString(), completed_at: new Date().toISOString() } : task
            ),
          };
        }
        return (old || []).map((task: Task) =>
          task.id === id ? { ...task, completed: true, status: 'completed', updated_at: new Date().toISOString(), completed_at: new Date().toISOString() } : task
        );
      });

      queryClient.setQueryData(['nextActions'], (old: TaskListResponse | undefined) => {
        if (old && 'items' in old) {
          return { ...old, items: old.items.filter((task: Task) => task.id !== id) };
        }
        return (old || []).filter((task: Task) => task.id !== id);
      });

      queryClient.setQueryData(['inbox'], (old: TaskListResponse | undefined) => {
        if (old && 'items' in old) {
          return { ...old, items: old.items.filter((task: Task) => task.id !== id) };
        }
        return (old || []).filter((task: Task) => task.id !== id);
      });

      return { previousTasks, previousNextActions, previousInbox };
    },
    onSuccess: (result) => {
      console.log('[useCompleteTask] onSuccess - result:', result);
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'tasks' });
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      queryClient.invalidateQueries({ queryKey: ['nextActions'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['tasks'], (context as any)?.previousTasks);
      queryClient.setQueryData(['nextActions'], (context as any)?.previousNextActions);
      queryClient.setQueryData(['inbox'], (context as any)?.previousInbox);
    },
  });
}

export function useSetNextAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, flag }: { id: number; flag: boolean }) => tasksAPI.setNextAction(id, flag),
    onMutate: async ({ id, flag }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['nextActions'] });
      const previousTasks = queryClient.getQueryData<TaskListResponse>(['tasks']);
      const previousNextActions = queryClient.getQueryData<TaskListResponse>(['nextActions']);

      queryClient.setQueryData(['tasks'], (old: TaskListResponse | undefined) => {
        if (old && 'items' in old) {
          return {
            ...old,
            items: old.items.map((task: Task) =>
              task.id === id ? { ...task, is_next_action: flag, updated_at: new Date().toISOString() } : task
            ),
          };
        }
        return (old || []).map((task: Task) =>
          task.id === id ? { ...task, is_next_action: flag, updated_at: new Date().toISOString() } : task
        );
      });

      queryClient.setQueryData(['nextActions'], (old: TaskListResponse | undefined) => {
        if (flag) {
          const newTaskItem = (old && 'items' in old ? old.items : old || []).find((task: Task) => task.id === id);
          if (newTaskItem) {
            if (old && 'items' in old) {
              return { ...old, items: [...old.items, { ...newTaskItem, is_next_action: true }] };
            }
            return [...(old || []), { ...newTaskItem, is_next_action: true }];
          }
        } else {
          if (old && 'items' in old) {
            return { ...old, items: old.items.filter((task: Task) => task.id !== id) };
          }
          return (old || []).filter((task: Task) => task.id !== id);
        }
        return old;
      });

      return { previousTasks, previousNextActions };
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(['tasks'], (context as any)?.previousTasks);
      queryClient.setQueryData(['nextActions'], (context as any)?.previousNextActions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'tasks' });
      queryClient.invalidateQueries({ queryKey: ['nextActions'] });
    },
  });
}

export function useDeletedTasks() {
  return useQuery({
    queryKey: ['deletedTasks'],
    queryFn: () => tasksAPI.getDeleted(),
  });
}

export function useRestoreTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => {
      console.log('[useRestoreTask] Starting restore for id:', id);
      return tasksAPI.restore(id);
    },
    onSuccess: (data, id) => {
      console.log('[useRestoreTask] Restore success for id:', id, 'result:', data);
    },
    onError: (error, id) => {
      console.error('[useRestoreTask] Restore error for id:', id, error);
    },
    onSettled: () => {
      console.log('[useRestoreTask] Restore settled');
      queryClient.invalidateQueries({ queryKey: ['deletedTasks'] });
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'tasks' });
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });
}

export function usePermanentDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tasksAPI.permanentDelete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['deletedTasks'] });
      const previousDeletedTasks = queryClient.getQueryData<Task[]>(['deletedTasks']);

      queryClient.setQueryData(['deletedTasks'], (old: Task[] | undefined) => {
        return (old || []).filter((task: Task) => task.id !== id);
      });

      return { previousDeletedTasks };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['deletedTasks'], (context as any)?.previousDeletedTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['deletedTasks'] });
    },
  });
}

export function useDeleteAllFromTrash() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => tasksAPI.deleteAllFromTrash(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['deletedTasks'] });
      const previousDeletedTasks = queryClient.getQueryData<Task[]>(['deletedTasks']);

      queryClient.setQueryData(['deletedTasks'], []);

      return { previousDeletedTasks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['deletedTasks'], (context as any)?.previousDeletedTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['deletedTasks'] });
    },
  });
}
