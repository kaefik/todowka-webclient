# Задача: Упростить NotificationManager компонент

## Описание
Убрать polling из NotificationManager, оставить только инициализацию SSE и browser notifications.

## Файл
`src/components/NotificationManager.tsx`

## Действия
1. Убрать весь polling код задач
2. Убрать все console.log кроме development
3. Передать queryClient в NotificationStream
4. Вызвать notificationStream.connect()
5. Добавить onNotification handler
6. Добавить cleanup

## Код
```typescript
'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { notificationStream } from '@/lib/services/NotificationStream';
import { notificationService } from '@/lib/services/NotificationService';

export function NotificationManager() {
  const queryClient = useQueryClient();

  useEffect(() => {
    notificationService.init();
    notificationStream.setQueryClient(queryClient);

    notificationStream.connect();

    const unsubscribe = notificationStream.onNotification((notification) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[NotificationManager] Received SSE notification:', notification);
      }
    });

    return () => {
      unsubscribe();
      notificationStream.disconnect();
    };
  }, [queryClient]);

  return null;
}
```

## Проверка
- Polling задач убран
- Query client передан
- connect() вызван
- onNotification handler добавлен
- Cleanup корректный
- console.log только в development

## Оценка
30 минут

## Зависимости
- L1/02-notificationstream-sse-connection.md
- L1/05-notificationstream-reconnection.md
