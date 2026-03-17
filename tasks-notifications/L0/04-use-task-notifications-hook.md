# Задача: Создать useTaskNotifications hook

## Описание
Создать React Query hook для получения уведомлений конкретной задачи.

## Файл
`src/lib/hooks/useNotifications.ts` (добавить в существующий файл)

## Действия
1. В том же файле src/lib/hooks/useNotifications.ts
2. Добавить useTaskNotifications(taskId) hook
3. Использовать queryKey: ['notifications', 'task', taskId]
4. Добавить enabled: !!taskId
5. Вызывать notificationsAPI.getById()

## Код
```typescript
export function useTaskNotifications(taskId: number) {
  return useQuery({
    queryKey: ['notifications', 'task', taskId],
    queryFn: () => notificationsAPI.getById(taskId),
    enabled: !!taskId,
  });
}
```

## Проверка
- hook экспортируется
- queryKey включает taskId
- enabled зависит от taskId
- вызов getById правильный

## Оценка
15 минут

## Зависимости
- L0/01-notifications-api.md
