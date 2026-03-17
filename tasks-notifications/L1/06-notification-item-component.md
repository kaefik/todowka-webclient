# Задача: Создать NotificationItem компонент

## Описание
Создать React компонент для отображения отдельного уведомления.

## Файл
`src/components/notifications/NotificationItem.tsx` (новый)

## Действия
1. Создать NotificationItem компонент с Props
2. Реализовать getStatusColor для цвета статуса
3. Реализовать formatDate для форматирования даты
4. Отобразить message, task_id, status
5. Показать кнопку "Отметить" если !read
6. НЕ отображать: metadata, error_message, delivery_method
7. Добавить стили для прочитанных/непрочитанных

## Код
```typescript
import { Notification } from '@/types';

interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: number) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className={`p-4 border-b last:border-b-0 ${
        !notification.read ? 'bg-blue-50' : 'bg-white'
      } hover:bg-gray-50 transition-colors`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-medium text-gray-900">{notification.message}</p>
          {notification.task_id && (
            <p className="text-sm text-gray-500 mt-1">
              Задача #{notification.task_id}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(notification.status)}`}>
            {notification.status}
          </span>
          {!notification.read && onRead && (
            <button
              onClick={() => onRead(notification.id)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Отметить
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-400">
          {formatDate(notification.created_at)}
        </p>
      </div>
    </div>
  );
}
```

## Проверка
- Компонент экспортируется
- Правильные типы Props
- Отображаются только нужные поля
- Стили для прочитанных/непрочитанных
- Кнопка только если !read

## Оценка
1 час

## Зависимости
- L0/05-notification-types.md
