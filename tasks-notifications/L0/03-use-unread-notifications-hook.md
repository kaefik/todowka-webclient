# Задача: Создать useUnreadNotifications hook

## Описание
Создать React Query hook для получения непрочитанных уведомлений.

## Файл
`src/lib/hooks/useNotifications.ts` (добавить в существующий файл)

## Действия
1. В том же файле src/lib/hooks/useNotifications.ts
2. Добавить useUnreadNotifications hook
3. Использовать queryKey: ['notifications', 'unread']
4. Установить refetchInterval: false

## Код
```typescript
export function useUnreadNotifications() {
  return useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsAPI.getUnread(),
    refetchInterval: false, // Нет polling по умолчанию
  });
}
```

## Проверка
- hook экспортируется
- queryKey правильный
- refetchInterval: false

## Оценка
15 минут

## Зависимости
- L0/01-notifications-api.md
