# Задача: Создать NotificationList компонент

## Описание
Создать React компонент для отображения списка уведомлений с пагинацией и действиями.

## Файл
`src/components/notifications/NotificationList.tsx` (новый)

## Действия
1. Использовать useNotifications hook
2. Обработать состояния: loading, error, empty
3. Отобразить список NotificationItem
4. Добавить limit prop для ограничения количества
5. Показать unread count badge
6. Добавить кнопку "Отметить все как прочитанные"
7. Добавить ссылку "Показать все" если limit < total

## Код
```typescript
import { useNotifications } from '@/lib/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';

interface NotificationListProps {
  limit?: number;
}

export function NotificationList({ limit }: NotificationListProps) {
  const { notifications, isLoading, error, markAsRead, markAllAsRead } = useNotifications();

  const displayedNotifications = limit
    ? notifications.slice(0, limit)
    : notifications;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Уведомления</h2>
        </div>
        <div className="p-4 text-center text-gray-500">
          Загрузка...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Уведомления</h2>
        </div>
        <div className="p-4 text-center text-red-500">
          Ошибка загрузки уведомлений
        </div>
      </div>
    );
  }

  if (displayedNotifications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Уведомления</h2>
        </div>
        <div className="p-8 text-center text-gray-500">
          <div className="text-4xl mb-2">🔔</div>
          <p>Нет уведомлений</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Уведомления
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-sm rounded-full">
              {unreadCount}
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Отметить все как прочитанные
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {displayedNotifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRead={markAsRead}
          />
        ))}
      </div>
      {limit && limit < notifications.length && (
        <div className="p-3 border-t text-center">
          <a
            href="/notifications"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Показать все ({notifications.length})
          </a>
        </div>
      )}
    </div>
  );
}
```

## Проверка
- Компонент экспортируется
- Все состояния обработаны
- Unread count отображается
- Кнопка "Отметить все" работает
- Limit работает корректно
- Ссылка "Показать все" когда нужно

## Оценка
1.5 часа

## Зависимости
- L0/02-use-notifications-hook.md
- L1/06-notification-item-component.md
