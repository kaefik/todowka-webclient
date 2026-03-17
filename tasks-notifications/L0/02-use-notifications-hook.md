# Задача: Создать useNotifications hook

## Описание
Создать React Query hook для управления уведомлениями с оптимистическими обновлениями.

## Файл
`src/lib/hooks/useNotifications.ts` (новый)

## Действия
1. Импортировать хуки из @tanstack/react-query
2. Импортировать notificationsAPI
3. Создать useNotifications hook с query и mutations
4. Добавить markAsRead mutation с invalidation
5. Добавить markAllAsRead mutation с invalidation
6. Установить refetchInterval: false (без polling по умолчанию)
7. Установить staleTime: 10000

## Код
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsAPI } from '@/lib/api/notifications';

export function useNotifications() {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsAPI.getAll(),
    refetchInterval: false, // Нет polling по умолчанию (SSE primary)
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
    notifications: notificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    refetch: notificationsQuery.refetch, // Для включения polling
  };
}
```

## Проверка
- hook экспортируется
- queryKey правильный
- mutations вызывают invalidation
- refetchInterval: false

## Оценка
30 минут

## Зависимости
- L0/01-notifications-api.md
