'use client';

import { useState } from 'react';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';

interface NotificationListProps {
  limit?: number;
}

export function NotificationList({ limit }: NotificationListProps) {
  const [page, setPage] = useState(1);
  const { 
    notifications, 
    total, 
    pages: totalPages, 
    isLoading, 
    error, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications(page, limit || 10);

  const displayedNotifications = limit
    ? notifications.slice(0, limit)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Уведомления
          <span className="px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
            {total}
          </span>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-sm rounded-full">
              {unreadCount} новых
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
      {!limit && totalPages > 1 && (
        <div className="p-3 border-t flex justify-between items-center">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          >
            Назад
          </button>
          <span className="text-sm text-gray-600">
            Страница {page} из {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          >
            Вперед
          </button>
        </div>
      )}
      {limit && limit < total && (
        <div className="p-3 border-t text-center">
          <a
            href="/notifications"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Показать все ({total})
          </a>
        </div>
      )}
    </div>
  );
}
