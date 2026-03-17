# Задача: Реализовать polling fallback в NotificationStream

## Описание
Реализовать переключение на polling mode и управление polling через React Query.

## Файл
`src/lib/services/NotificationStream.ts`

## Действия
1. Реализовать switchToPolling()
2. Реализовать enablePolling()
3. Реализовать disablePolling()
4. Реализовать invalidateCache()
5. Добавить логику показа уведомления через 5 минут polling

## Код (добавить в класс):
```typescript
private switchToPolling(): void {
  if (this.isPollingMode) return;

  console.log('[NotificationStream] Switching to polling mode');

  if (this.eventSource) {
    this.eventSource.close();
    this.eventSource = null;
  }
  if (this.connectTimeoutTimer) {
    clearTimeout(this.connectTimeoutTimer);
    this.connectTimeoutTimer = null;
  }

  this.isPollingMode = true;
  this.pollingStartTime = Date.now();
  this.enablePolling();

  setTimeout(() => {
    if (this.isPollingMode) {
      this.showPollingModeNotification();
    }
  }, this.POLLING_NOTIFY_THRESHOLD);
}

private enablePolling(): void {
  if (!this.queryClient) return;

  const notificationsQuery = this.queryClient.getQueryCache().find({ queryKey: ['notifications'] });
  if (notificationsQuery) {
    const observer = (notificationsQuery as any).observers[0];
    if (observer) {
      observer.refetch({ refetchInterval: 30000 });
    }
  }

  const unreadQuery = this.queryClient.getQueryCache().find({ queryKey: ['notifications', 'unread'] });
  if (unreadQuery) {
    const observer = (unreadQuery as any).observers[0];
    if (observer) {
      observer.refetch({ refetchInterval: 30000 });
    }
  }
}

private disablePolling(): void {
  if (!this.queryClient) return;

  const notificationsQuery = this.queryClient.getQueryCache().find({ queryKey: ['notifications'] });
  if (notificationsQuery) {
    const observer = (notificationsQuery as any).observers[0];
    if (observer) {
      observer.refetch({ refetchInterval: false });
    }
  }

  const unreadQuery = this.queryClient.getQueryCache().find({ queryKey: ['notifications', 'unread'] });
  if (unreadQuery) {
    const observer = (unreadQuery as any).observers[0];
    if (observer) {
      observer.refetch({ refetchInterval: false });
    }
  }
}

private invalidateCache(): void {
  if (!this.queryClient) return;
  this.queryClient.invalidateQueries({ queryKey: ['notifications'] });
  this.queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
}
```

## Проверка
- switchToPolling закрывает SSE
- enablePolling включает refetchInterval: 30000
- disablePolling отключает polling
- invalidateCache работает для обоих query keys

## Оценка
45 минут

## Зависимости
- L1/02-notificationstream-sse-connection.md
