# Задача: Реализовать reconnection logic в NotificationStream

## Описание
Реализовать логику автоматического переподключения к SSE каждые 60 секунд.

## Файл
`src/lib/services/NotificationStream.ts`

## Действия
1. Реализовать tryReconnect()
2. Реализовать scheduleReconnect()
3. Добавить вызов scheduleReconnect в switchToPolling()
4. Убедиться что onopen очищает reconnect timer

## Код (добавить в класс):
```typescript
private tryReconnect(): void {
  console.log('[NotificationStream] Attempting to reconnect SSE...');

  this.disablePolling();
  this.connect();
}

private scheduleReconnect(): void {
  if (this.reconnectTimer) {
    clearTimeout(this.reconnectTimer);
  }

  this.reconnectTimer = setTimeout(() => {
    this.tryReconnect();
  }, this.RECONNECT_INTERVAL);
}
```

И добавить в switchToPolling() после enablePolling():
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

  this.scheduleReconnect(); // Добавить эту строку

  setTimeout(() => {
    if (this.isPollingMode) {
      this.showPollingModeNotification();
    }
  }, this.POLLING_NOTIFY_THRESHOLD);
}
```

## Проверка
- scheduleReconnect создает таймер на 60 сек
- tryReconnect отключает polling и вызывает connect()
- scheduleReconnect вызывается в switchToPolling()
- onopen очищает reconnectTimer

## Оценка
30 минут

## Зависимости
- L1/04-notificationstream-polling-fallback.md
