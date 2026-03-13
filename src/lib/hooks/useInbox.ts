'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inboxAPI } from '@/lib/api/inbox';
import type { InboxCreate, Task, TaskStatus, TaskPriority, TaskListResponse } from '@/types';

export function useInbox() {
  return useQuery({
    queryKey: ['inbox'],
    queryFn: () => inboxAPI.getAll(),
  });
}

export function useCreateInboxTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InboxCreate) => inboxAPI.create(data),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ['inbox'] });
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousInbox = queryClient.getQueryData<TaskListResponse>(['inbox']);
      const previousTasks = queryClient.getQueryData<TaskListResponse>(['tasks']);

      const newTaskItem = {
        ...newTask,
        id: Date.now(),
        status: 'inbox' as TaskStatus,
        priority: 'medium' as TaskPriority,
        completed: false,
        someday: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tag_ids: [],
        is_next_action: false,
        tags: [],
      } as Task;

      queryClient.setQueryData(['inbox'], (old: TaskListResponse | undefined) => {
        if (old && 'items' in old) {
          return { ...old, items: [newTaskItem, ...old.items] };
        }
        return [newTaskItem, ...(old || [])];
      });

      queryClient.setQueryData(['tasks'], (old: TaskListResponse | undefined) => {
        if (old && 'items' in old) {
          return { ...old, items: [newTaskItem, ...old.items] };
        }
        return [newTaskItem, ...(old || [])];
      });

      return { previousInbox, previousTasks };
    },
    onError: (err, newTask, context) => {
      queryClient.setQueryData(['inbox'], (context as any)?.previousInbox);
      queryClient.setQueryData(['tasks'], (context as any)?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
