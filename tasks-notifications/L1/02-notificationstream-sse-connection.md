# Задача: Реализовать SSE connection в NotificationStream

## Описание
Реализовать логику подключения к SSE endpoint с обработкой onopen, onmessage, onerror.

## Файл
`src/lib/services/NotificationStream.ts`

## Действия
1. Реализовать метод connect()
2. Создать EventSource с URL: NEXT_PUBLIC_API_URL/api/v1/notifications/stream
3. Добавить таймаут подключения (30 сек)
4. Реализовать onopen handler
5. Реализовать onmessage handler
6. Реализовать onerror handler
7. Очистка таймеров при успешном подключении

## Код (добавить в класс):
```typescript
connect(): void {
  if (typeof window === 'undefined' || this.eventSource) {
    return;
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/stream`;

  this.eventSource = new EventSource(url);

  // Таймаут подключения
  this.connectTimeoutTimer = setTimeout(() => {
    if (this.eventSource && this.eventSource.readyState === EventSource.CONNECTING) {
      console.warn('[NotificationStream] Connection timeout after 30s, switching to polling');
      this.switchToPolling();
    }
  }, this.CONNECTION_TIMEOUT);

  this.eventSource.onopen = () => {
    console.log('[NotificationStream] Connected via SSE');
    this.isPollingMode = false;
    this.pollingStartTime = null;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.connectTimeoutTimer) {
      clearTimeout(this.connectTimeoutTimer);
      this.connectTimeoutTimer = null;
    }

    this.invalidateCache();
  };

  this.eventSource.onmessage = (event) => {
    try {
      const notification: NotificationData = JSON.parse(event.data);

      this.saveLastNotificationId(notification.id);
      this.invalidateCache();
      this.notifyHandlers(notification);
      this.showBrowserNotification(notification);

    } catch (error) {
      console.error('[NotificationStream] Error parsing notification:', error);
    }
  };

  this.eventSource.onerror = (error) => {
    console.error('[NotificationStream] SSE error:', error);
    this.eventSource?.close();
    this.eventSource = null;
    this.switchToPolling();
  };
}
```

## Проверка
- EventSource создается с правильным URL
- Таймаут работает
- onopen очищает таймеры
- onmessage парсит JSON
- onerror вызывает switchToPolling

## Оценка
45 минут

## Зависимости
- L1/01-notificationstream-structure.md
