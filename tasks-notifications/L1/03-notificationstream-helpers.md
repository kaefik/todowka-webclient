# Задача: Реализовать helper методы NotificationStream

## Описание
Реализовать вспомогательные методы для обработки уведомлений, кэша и localStorage.

## Файл
`src/lib/services/NotificationStream.ts`

## Действия
1. Реализовать onNotification(handler) метод
2. Реализовать saveLastNotificationId(id)
3. Реализовать getLastNotificationId()
4. Реализовать notifyHandlers(notification)
5. Реализовать showBrowserNotification(notification)
6. Реализовать showPollingModeNotification()

## Код (добавить в класс):
```typescript
onNotification(handler: (notification: NotificationData) => void): () => void {
  this.handlers.add(handler);
  return () => this.handlers.delete(handler);
}

private saveLastNotificationId(id: number): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(this.STORAGE_KEY, id.toString());
  }
}

private getLastNotificationId(): number {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  }
  return 0;
}

private notifyHandlers(notification: NotificationData): void {
  this.handlers.forEach(handler => handler(notification));
}

private showBrowserNotification(notification: NotificationData): void {
  if (notificationService.canShow()) {
    notificationService.show('Task Reminder', {
      body: notification.message,
      tag: `notification-${notification.id}`,
      requireInteraction: true,
    });
  }
}

private showPollingModeNotification(): void {
  if (notificationService.canShow()) {
    notificationService.show('Уведомление', {
      body: 'Режим реального времени недоступен. Проверьте подключение к интернету.',
      tag: 'polling-mode-notify',
      requireInteraction: false,
    });
  }
}
```

## Проверка
- onNotification возвращает unsubscribe функцию
- localStorage только в браузере
- notificationService используется корректно
- notifyHandlers вызывает все handlers

## Оценка
30 минут

## Зависимости
- L1/01-notificationstream-structure.md
