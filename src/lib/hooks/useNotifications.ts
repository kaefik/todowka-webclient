import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsAPI } from '@/lib/api/notifications';
import type { Notification, PaginatedResponse } from '@/types';

export function useNotifications(page: number = 1, limit: number = 10) {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: () => notificationsAPI.getAll(page, limit),
    refetchInterval: false,
    staleTime: 10000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationsAPI.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsAPI.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
    },
  });

  return {
    notifications: notificationsQuery.data?.items || [],
    total: notificationsQuery.data?.total || 0,
    page: notificationsQuery.data?.page || page,
    limit: notificationsQuery.data?.limit || limit,
    pages: notificationsQuery.data?.pages || 0,
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    refetch: notificationsQuery.refetch,
  };
}

export function useUnreadNotifications() {
  return useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsAPI.getUnread(),
    refetchInterval: false,
  });
}

export function useTaskNotifications(taskId: number) {
  return useQuery({
    queryKey: ['notifications', 'task', taskId],
    queryFn: () => notificationsAPI.getById(taskId),
    enabled: !!taskId,
  });
}
