# План внедрения оповещений пользователей - Web Client v2.0

**Дата:** 2026-03-17
**Проект:** todowka-webclient (Next.js)
**Версия:** 2.0 (с учетом правок по результатам анализа)
**Цель:** Полнофункциональная система получения и отображения уведомлений с real-time поддержкой

---

## Ключевые изменения v1.0 → v2.0

### ✅ Архитектурные улучшения:
- Удален NotificationContext (используем только React Query)
- Добавлен SSE fallback механизм (30 сек таймаут → polling)
- Унифицированы все polling intervals на 30 сек
- Используется существующий notificationsAPI вместо прямых fetch

### 📝 Новые компоненты:
- Health check мониторинг (5 минут, страница /settings)
- Online/offline индикатор (Sidebar/BottomNavigation)
- SSE timeout логика для переключения на polling

---

## Текущее состояние

### Реализовано
- ✅ Browser notifications (NotificationService)
- ✅ NotificationManager проверяет задачи напрямую (polling 30 сек)
- ✅ notifications.ts API клиент

### Не реализовано
- ❌ API notifications.ts НЕ ИСПОЛЬЗУЕТСЯ
- ❌ Нет useNotifications hook
- ❌ Нет страницы /notifications
- ❌ Нет SSE клиента
- ❌ Нет центра уведомлений в UI
- ❌ Много console.log в NotificationManager (production)

---

## Архитектура системы

```
┌─────────────────────────────────────────────────────────────────┐
│  API Server (todowka)                                            │
│  ├─ SSE endpoint (/api/v1/notifications/stream)                 │
│  ├─ Health check (/api/v1/health/notifications)                │
│  └─ REST endpoints (notifications, unread, etc.)               │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│  Web Client (todowka-webclient)                                  │
│  ├─ NotificationStream (SSE client + fallback polling)         │
│  ├─ React Query (state management + caching)                   │
│  ├─ notificationsAPI (API integration)                         │
│  └─ Health Monitor (5 min checks)                              │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│  UI Components                                                   │
│  ├─ NotificationCenter (dropdown)                              │
│  ├─ NotificationList (список)                                 │
│  ├─ Online/offline индикатор (Sidebar/BottomNavigation)       │
│  └─ Health status (страница /settings)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Задачи (по приоритету)

### 📌 Задача 1: Создать useNotifications hook

**Создать файл:** `src/lib/hooks/useNotifications.ts`

**Содержимое:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsAPI } from '@/lib/api/notifications';

export function useNotifications() {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsAPI.getAll(),
    refetchInterval: 30000, // 30 сек - унифицировано
    staleTime: 10000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) =>
      notificationsAPI.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () =>
      notificationsAPI.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
    },
  });

  return {
    notifications: notificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
}

export function useUnreadNotifications() {
  return useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsAPI.getUnread(),
    refetchInterval: 30000, // 30 сек - унифицировано
  });
}

export function useTaskNotifications(taskId: number) {
  return useQuery({
    queryKey: ['notifications', 'task', taskId],
    queryFn: () => notificationsAPI.getTaskNotifications(taskId),
    enabled: !!taskId,
  });
}
```

**Примечания:**
- Используется существующий `notificationsAPI` вместо прямых fetch
- Все refetchInterval унифицированы на 30 сек

**Проверка работы:**
```typescript
// В компоненте
import { useNotifications, useUnreadNotifications } from '@/lib/hooks/useNotifications';

function TestComponent() {
  const { notifications, markAsRead } = useNotifications();
  const { data: unread } = useUnreadNotifications();

  console.log('All notifications:', notifications);
  console.log('Unread count:', unread?.length);
}
```

**Оценка времени:** 1 час

---
### 📌 Задача 2: Создать SSE клиент с fallback логикой

**Создать файл:** `src/lib/services/NotificationStream.ts`

**Содержимое:**
```typescript
import { notificationService } from './NotificationService';

interface NotificationData {
  id: number;
  message: string;
  task_id?: number;
  status: string;
  scheduled_at: string;
  created_at: string;
}

interface NotificationStreamConfig {
  connectTimeout: number;      // 30 сек - таймаут соединения
  reconnectAttempts: number;    // Макс попыток переподключения
  reconnectDelay: number;        // Задержка между попытками (мс)
  pollingFallback: boolean;      // Использовать polling fallback
  pollInterval: number;        // Интервал polling (мс)
}

class NotificationStream {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private isConnecting = false;
  private isPollingMode = false;
  private pollingTimer: NodeJS.Timeout | null = null;
  private pollingStartTime: number | null = null;

  private readonly STORAGE_KEY = 'last_notification_id';
  private readonly POLLING_NOTIFY_THRESHOLD = 5 * 60 * 1000; // 5 минут
  private readonly handlers: Set<(notification: NotificationData) => void> = new Set();

  // Конфигурация по умолчанию
  private config: NotificationStreamConfig = {
    connectTimeout: 30000,      // 30 сек
    reconnectAttempts: 5,
    reconnectDelay: 3000,
    pollingFallback: true,
    pollInterval: 30000,        // 30 сек
  };

  private connectTimeoutTimer: NodeJS.Timeout | null = null;

  connect(): void {
    if (typeof window === 'undefined' || this.eventSource) {
      return;
    }

    this.isConnecting = true;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/stream`;

    this.eventSource = new EventSource(url);

    // Таймаут подключения
    this.connectTimeoutTimer = setTimeout(() => {
      if (this.isConnecting) {
        console.warn('[NotificationStream] Connection timeout after 30s, switching to polling');
        this.switchToPolling();
      }
    }, this.config.connectTimeout);

    this.eventSource.onopen = () => {
      console.log('[NotificationStream] Connected via SSE');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.isPollingMode = false;

      // Очистка таймаута
      if (this.connectTimeoutTimer) {
        clearTimeout(this.connectTimeoutTimer);
        this.connectTimeoutTimer = null;
      }

      // Очистка polling если был активен
      this.stopPolling();
    };

    this.eventSource.onmessage = (event) => {
      try {
        const notification: NotificationData = JSON.parse(event.data);
        this.saveLastNotificationId(notification.id);
        this.notifyHandlers(notification);
        this.showBrowserNotification(notification);
      } catch (error) {
        console.error('[NotificationStream] Error parsing notification:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('[NotificationStream] Error:', error);
      this.eventSource?.close();
      this.eventSource = null;

      // Переключение на polling при ошибках
      if (this.config.pollingFallback) {
        this.switchToPolling();
      }
    };
  }

  private switchToPolling(): void {
    console.log('[NotificationStream] Switching to polling mode');
    
    // Закрытие SSE
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.connectTimeoutTimer) {
      clearTimeout(this.connectTimeoutTimer);
      this.connectTimeoutTimer = null;
    }

    this.isConnecting = false;
    this.isPollingMode = true;
    this.pollingStartTime = Date.now();

    // Начало polling
    this.startPolling();
  }

  private startPolling(): void {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
    }

    // Первая проверка сразу
    this.pollNotifications();

    // Периодический polling
    this.pollingTimer = setInterval(() => {
      this.pollNotifications();
      
      // Проверка если polling длится > 5 минут
      if (this.pollingStartTime && (Date.now() - this.pollingStartTime > this.POLLING_NOTIFY_THRESHOLD)) {
        this.showPollingModeNotification();
        this.pollingStartTime = null; // Не показывать повторно
      }
    }, this.config.pollInterval);
  }

  private stopPolling(): void {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
  }

  private pollNotifications(): void {
    // Polling реализация будет использовать React Query через useNotifications
    // Этот метод просто триггерит обновление через event handlers
    console.log('[NotificationStream] Polling for notifications...');
    // Реальная логика в useNotifications hook с refetchInterval
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

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.stopPolling();
    this.isConnecting = false;
    this.isPollingMode = false;
    if (this.connectTimeoutTimer) {
      clearTimeout(this.connectTimeoutTimer);
      this.connectTimeoutTimer = null;
    }
  }

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

  // Public method для проверки режима
  getConnectionMode(): 'sse' | 'polling' | 'disconnected' {
    if (this.isPollingMode) return 'polling';
    if (this.eventSource) return 'sse';
    return 'disconnected';
  }
}

export { NotificationStream };
export const notificationStream = new NotificationStream();
```

**Примечания:**
- Таймаут соединения: 30 секунд
- Автоматическое переключение на polling при timeout/error
- Polling interval: 30 секунд (унифицировано)
- Уведомление пользователю через 5 минут polling режима
- Метод `getConnectionMode()` для текущего состояния

**Проверка работы:**
```typescript
// В компоненте
import { notificationStream } from '@/lib/services/NotificationStream';

useEffect(() => {
  const unsubscribe = notificationStream.onNotification((notification) => {
    console.log('New notification:', notification);
    console.log('Connection mode:', notificationStream.getConnectionMode());
  });

  notificationStream.connect();

  return () => {
    unsubscribe();
    notificationStream.disconnect();
  };
}, []);
```

**Оценка времени:** 3-4 часа

---
### 📌 Задача 3: Создать компонент NotificationItem

**Создать файл:** `src/components/notifications/NotificationItem.tsx`

**Содержимое:**
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
        {notification.scheduled_at && (
          <p className="text-xs text-gray-400">
            Запланировано: {formatDate(notification.scheduled_at)}
          </p>
        )}
      </div>
    </div>
  );
}
```

**Примечания:**
- Не отображаются: `metadata`, `error_message`, `delivery_method` (решение v2.0)

**Оценка времени:** 1 час

---

### 📌 Задача 4: Создать компонент NotificationList

**Создать файл:** `src/components/notifications/NotificationList.tsx`

**Содержимое:**
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

**Примечания:**
- Без фильтрации (решение v2.0 - фильтрация пока не нужна)

**Оценка времени:** 1.5 часа

---

### 📌 Задача 5: Создать страницу /notifications

**Создать файл:** `src/app/notifications/page.tsx`

**Содержимое:**
```typescript
'use client';

import { NotificationList } from '@/components/notifications/NotificationList';

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Уведомления</h1>
      <NotificationList />
    </div>
  );
}
```

**Создать файл:** `src/app/notifications/layout.tsx`
```typescript
export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
```

**Проверка работы:**
```bash
# Запустить dev сервер
npm run dev

# Открыть в браузере
http://localhost:3000/notifications
```

**Оценка времени:** 30 мин

---

### 📌 Задача 6: Создать компонент NotificationCenter (dropdown)

**Создать файл:** `src/components/layout/NotificationCenter.tsx`

**Содержимое:**
```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { useUnreadNotifications } from '@/lib/hooks/useNotifications';
import { NotificationList } from '@/components/notifications/NotificationList';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: unreadNotifications, isLoading } = useUnreadNotifications();

  const unreadCount = unreadNotifications?.length || 0;

  // Закрытие dropdown при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Уведомления"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <NotificationList limit={5} />
          </div>
          <div className="p-3 border-t bg-gray-50">
            <a
              href="/notifications"
              className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              Все уведомления →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Оценка времени:** 1.5 часа

---

### 📌 Задача 7: Добавить NotificationCenter в Header

**Изменить файл:** `src/components/layout/Header.tsx`

**Что добавить:**
```typescript
import { NotificationCenter } from './NotificationCenter';

// Внутри компонента Header добавить
<div className="flex items-center gap-4">
  {/* ... другие элементы ... */}
  <NotificationCenter />
</div>
```

**Проверка работы:**
```bash
# Запустить dev сервер
npm run dev

# Проверить что NotificationCenter отображается в Header
# Клик на иконку должен открывать dropdown
```

**Оценка времени:** 30 мин

---
### 📌 Задача 8: Обновить NotificationManager (удален NotificationContext)

**Изменить файл:** `src/components/NotificationManager.tsx`

**Что изменить:**
```typescript
'use client';

import { useEffect, useRef } from 'react';
import { notificationStream } from '@/lib/services/NotificationStream';
import { notificationService } from '@/lib/services/NotificationService';
import { useTasks } from '@/lib/hooks/useTasks';

export function NotificationManager() {
  const { data: tasks } = useTasks();
  const intervalRef = useRef<NodeJS.Timeout>();
  const checkedTasks = useRef<Set<number>>(new Set());

  // Инициализация SSE потока
  useEffect(() => {
    notificationService.init();

    const unsubscribe = notificationStream.onNotification((notification) => {
      // SSE доставляет уведомления в реальном времени
      // Дополнительные действия можно добавить здесь
      if (process.env.NODE_ENV === 'development') {
        console.log('[NotificationManager] Received notification:', notification);
      }
    });

    notificationStream.connect();

    return () => {
      unsubscribe();
      notificationStream.disconnect();
    };
  }, []);

  // Резервный polling для проверки напоминаний
  // Активен только когда SSE недоступен (notificationStream в polling режиме)
  const checkReminders = () => {
    // Проверяем режим подключения
    const connectionMode = notificationStream.getConnectionMode();
    
    // Polling только если SSE недоступен
    if (connectionMode === 'sse') {
      return;
    }

    const now = Date.now();
    const checkWindow = 300000; // 5 minutes window

    if (!tasks) return;

    const tasksArray = Array.isArray(tasks) ? tasks : (tasks as any).items || [];

    tasksArray.forEach((task: any) => {
      const reminderEnabled = task.reminder_enabled === true;

      if (!reminderEnabled || !task.reminder_time || task.completed) {
        return;
      }

      const reminderTime = new Date(task.reminder_time).getTime();
      const timeDiff = reminderTime - now;

      // Показываем только если не было ранее и в пределах окна
      if (timeDiff <= 0 && timeDiff > -checkWindow && !checkedTasks.current.has(task.id)) {
        notificationService.showReminder(task.title, task.due_date || task.reminder_time);
        checkedTasks.current.add(task.id);
      }
    });
  };

  useEffect(() => {
    if (!tasks) return;

    checkReminders();
    intervalRef.current = setInterval(checkReminders, 30000); // 30 сек - унифицировано

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [tasks]);

  return null;
}
```

**Примечания:**
- ✅ Все console.log удалены или обернуты в `process.env.NODE_ENV === 'development'`
- ✅ Polling активен только когда SSE недоступен (проверка `connectionMode`)
- ✅ Удален NotificationContext (используем React Query напрямую)
- ✅ Polling interval унифицирован на 30 сек

**Оценка времени:** 1 час

---

### 📌 Задача 9: Создать Online/Offline индикатор

**Создать файл:** `src/components/layout/ConnectionStatus.tsx`

**Содержимое:**
```typescript
'use client';

import { useState, useEffect } from 'react';

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Проверяем начальный статус
    setIsOnline(navigator.onLine);

    // Слушатели событий
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Не отображаем если онлайн (чтобы не загромождать UI)
  if (isOnline) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      <span className="text-sm font-medium text-red-700">Offline</span>
    </div>
  );
}
```

**Примечания:**
- Отображается только в offline режиме
- Индикатор с пульсацией
- Размещение: Sidebar (десктоп) / BottomNavigation (мобильный)

**Оценка времени:** 30 мин

---

### 📌 Задача 10: Создать Health check мониторинг

**Создать файл:** `src/lib/hooks/useHealthCheck.ts`

**Содержимое:**
```typescript
import { useState, useEffect } from 'react';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'offline';
  sse: 'available' | 'unavailable';
  celery: 'running' | 'stopped';
  redis: 'running' | 'stopped';
  timestamp: string;
}

export function useHealthCheck(interval: number = 5 * 60 * 1000) {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkHealth = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/health/notifications`);
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      console.error('[HealthCheck] Error:', error);
      setHealth({
        status: 'offline',
        sse: 'unavailable',
        celery: 'stopped',
        redis: 'stopped',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const intervalId = setInterval(checkHealth, interval);
    return () => clearInterval(intervalId);
  }, [interval]);

  return { health, isLoading, refreshHealth: checkHealth };
}
```

**Примечания:**
- Интервал по умолчанию: 5 минут
- Возвращает null пока не получен первый ответ
- Возможность ручного обновления через `refreshHealth`

**Оценка времени:** 1 час

---

### 📌 Задача 11: Создать страницу настроек с Health Status

**Создать файл:** `src/app/settings/page.tsx`

**Содержимое:**
```typescript
'use client';

import { useHealthCheck } from '@/lib/hooks/useHealthCheck';

export default function SettingsPage() {
  const { health, isLoading, refreshHealth } = useHealthCheck();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Настройки</h1>

      {/* Health Status Section */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Состояние системы</h2>
          <button
            onClick={refreshHealth}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Обновить
          </button>
        </div>
        
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            Загрузка...
          </div>
        ) : health ? (
          <div className="p-4 space-y-4">
            {/* Overall Status */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Общий статус</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(health.status)}`}>
                {health.status.toUpperCase()}
              </span>
            </div>

            {/* SSE Status */}
            <div className="flex justify-between items-center">
              <span className="font-medium">SSE (Real-time)</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                health.sse === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {health.sse === 'available' ? '🟢 Доступен' : '🔴 Недоступен'}
              </span>
            </div>

            {/* Celery Status */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Celery (Background tasks)</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                health.celery === 'running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {health.celery === 'running' ? '🟢 Работает' : '🔴 Остановлен'}
              </span>
            </div>

            {/* Redis Status */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Redis (Pub/Sub)</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                health.redis === 'running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {health.redis === 'running' ? '🟢 Работает' : '🔴 Остановлен'}
              </span>
            </div>

            {/* Active Connections */}
            {health.active_connections !== undefined && (
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">Активные SSE подключения</span>
                <span className="text-gray-600">{health.active_connections} / 100</span>
              </div>
            )}

            {/* Last Check Time */}
            <div className="text-xs text-gray-400 pt-2 border-t">
              Последняя проверка: {new Date(health.timestamp).toLocaleString('ru-RU')}
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-red-500">
            Не удалось получить статус системы
          </div>
        )}
      </div>

      {/* TODO: Future settings sections */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Настройки уведомлений</h2>
        <p className="text-gray-500">В будущих версиях здесь будут настройки уведомлений</p>
      </div>
    </div>
  );
}
```

**Примечания:**
- Размещение: страница /settings
- Кнопка обновления для ручной проверки
- Детальный статус всех компонентов системы
- Активные SSE подключения

**Создать файл:** `src/app/settings/layout.tsx`
```typescript
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
```

**Оценка времени:** 2 часа

---
### 📌 Задача 12: Добавить Navigation для страницы уведомлений

**Изменить файл:** `src/components/layout/BottomNavigation.tsx` (мобильная версия)

**Что добавить:**
```typescript
// В массив items добавить
{
  path: '/notifications',
  label: 'Уведомления',
  icon: '🔔',
  badge: unreadCount
}
```

**Изменить файл:** `src/components/layout/Sidebar.tsx` (десктопная версия)

**Что добавить:**
```typescript
import { useUnreadNotifications } from '@/lib/hooks/useNotifications';
import { ConnectionStatus } from './ConnectionStatus';

// Внутри компонента Sidebar
const { data: unreadNotifications } = useUnreadNotifications();
const unreadCount = unreadNotifications?.length || 0;

// В секцию навигации добавить
<a
  href="/notifications"
  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
>
  <span className="text-xl">🔔</span>
  <span>Уведомления</span>
  {unreadCount > 0 && (
    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
      {unreadCount}
    </span>
  )}
</a>

// Добавить ConnectionStatus индикатор
<div className="mt-auto pt-4 border-t">
  <ConnectionStatus />
  <a
    href="/settings"
    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
  >
    <span className="text-xl">⚙️</span>
    <span>Настройки</span>
  </a>
</div>
```

**Изменить файл:** `src/components/layout/BottomNavigation.tsx` (mobile)

**Что добавить:**
```typescript
import { ConnectionStatus } from './ConnectionStatus';

// Добавить ConnectionStatus компонент
<div className="fixed bottom-16 left-0 right-0 p-2">
  <ConnectionStatus />
</div>
```

**Проверка работы:**
```bash
# На мобильном устройстве проверить BottomNavigation
# На десктопе проверить Sidebar
```

**Оценка времени:** 1 час

---

### 📌 Задача 13: Обновить типы

**Изменить файл:** `src/types/index.ts`

**Обновить интерфейс Notification:**
```typescript
export interface Notification {
  id: number;
  task_id: number;
  message: string;
  status: NotificationStatus;
  scheduled_at: string;
  sent_at?: string;
  error_message?: string;        // Не отображается в UI (v2.0 решение)
  delivery_method: string;        // Не отображается в UI (v2.0 решение)
  read: boolean;
  metadata?: Record<string, any>; // Не отображается в UI (v2.0 решение)
  created_at: string;
  updated_at: string;
}

export type NotificationStatus = 'pending' | 'sent' | 'failed';
```

**Оценка времени:** 15 мин

---

### 📌 Задача 14: Добавить тесты для компонентов

**Создать файл:** `src/components/notifications/__tests__/NotificationItem.test.tsx`
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationItem } from '../NotificationItem';
import { Notification } from '@/types';

const mockNotification: Notification = {
  id: 1,
  task_id: 1,
  message: 'Test notification',
  status: 'pending',
  scheduled_at: '2026-03-17T12:00:00',
  sent_at: null,
  error_message: null,
  delivery_method: 'sse',
  read: false,
  metadata: null,
  created_at: '2026-03-17T10:00:00',
  updated_at: '2026-03-17T10:00:00',
};

describe('NotificationItem', () => {
  it('renders notification message', () => {
    render(<NotificationItem notification={mockNotification} />);
    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });

  it('shows task ID', () => {
    render(<NotificationItem notification={mockNotification} />);
    expect(screen.getByText('Задача #1')).toBeInTheDocument();
  });

  it('shows unread styling when not read', () => {
    const { container } = render(<NotificationItem notification={mockNotification} />);
    expect(container.firstChild).toHaveClass('bg-blue-50');
  });

  it('shows read styling when read', () => {
    const readNotification = { ...mockNotification, read: true };
    const { container } = render(<NotificationItem notification={readNotification} />);
    expect(container.firstChild).toHaveClass('bg-white');
  });

  it('calls onRead when button clicked', () => {
    const onRead = jest.fn();
    render(<NotificationItem notification={mockNotification} onRead={onRead} />);
    fireEvent.click(screen.getByText('Отметить'));
    expect(onRead).toHaveBeenCalledWith(1);
  });

  it('does not show error_message in UI', () => {
    const notificationWithError = {
      ...mockNotification,
      error_message: 'Test error',
    };
    render(<NotificationItem notification={notificationWithError} />);
    expect(screen.queryByText('Test error')).not.toBeInTheDocument();
  });
});
```

**Создать файл:** `src/components/notifications/__tests__/NotificationList.test.tsx`
```typescript
import { render, screen } from '@testing-library/react';
import { NotificationList } from '../NotificationList';

jest.mock('@/lib/hooks/useNotifications', () => ({
  useNotifications: () => ({
    notifications: [
      {
        id: 1,
        task_id: 1,
        message: 'Test notification',
        status: 'pending',
        scheduled_at: '2026-03-17T12:00:00',
        sent_at: null,
        error_message: null,
        delivery_method: 'sse',
        read: false,
        metadata: null,
        created_at: '2026-03-17T10:00:00',
        updated_at: '2026-03-17T10:00:00',
      },
    ],
    isLoading: false,
    error: null,
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
  }),
}));

describe('NotificationList', () => {
  it('renders notifications', () => {
    render(<NotificationList />);
    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });

  it('shows unread count', () => {
    render(<NotificationList />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows "mark all as read" button when unread exists', () => {
    render(<NotificationList />);
    expect(screen.getByText('Отметить все как прочитанные')).toBeInTheDocument();
  });
});
```

**Запуск тестов:**
```bash
npm test src/components/notifications/__tests__/
```

**Оценка времени:** 2-3 часа

---

### 📌 Задача 15: Добавить тесты для NotificationStream

**Создать файл:** `src/lib/services/__tests__/NotificationStream.test.ts`
```typescript
import { NotificationStream } from '../NotificationStream';
import { notificationService } from '../NotificationService';

// Mock notification service
jest.mock('../NotificationService');

describe('NotificationStream', () => {
  let stream: NotificationStream;

  beforeEach(() => {
    stream = new NotificationStream();
    jest.clearAllMocks();
  });

  afterEach(() => {
    stream.disconnect();
  });

  it('initializes with disconnected status', () => {
    expect(stream.getConnectionMode()).toBe('disconnected');
  });

  it('sets up SSE connection on connect', () => {
    stream.connect();
    expect(stream.getConnectionMode()).toBe('sse');
  });

  it('switches to polling after timeout', (done) => {
    jest.useFakeTimers();
    stream.connect();
    
    setTimeout(() => {
      expect(stream.getConnectionMode()).toBe('polling');
      done();
    }, 30001); // 30 сек + 1 мс
    
    jest.advanceTimersByTime(31000);
    jest.useRealTimers();
  });

  it('notifies handlers when SSE message received', () => {
    const handler = jest.fn();
    stream.onNotification(handler);
    
    // Имитация SSE сообщения
    const mockEvent = { data: JSON.stringify({
      id: 1,
      message: 'Test',
      status: 'sent',
      created_at: '2026-03-17T10:00:00',
    })};
    
    stream.onMessage(mockEvent as any);
    expect(handler).toHaveBeenCalled();
  });

  it('disconnects properly', () => {
    stream.connect();
    stream.disconnect();
    expect(stream.getConnectionMode()).toBe('disconnected');
  });
});
```

**Оценка времени:** 2 часа

---
### 📌 Задача 16: Обновить документацию

**Обновить файл:** `README.md`

**Добавить секцию:**
```markdown
## Уведомления

### Features
- Real-time уведомления через SSE
- Automatic fallback на polling при недоступности SSE
- Browser notifications (если разрешено пользователем)
- Центр уведомлений с dropdown
- История всех уведомлений на странице /notifications
- Badge счетчики в навигации
- Отметка как прочитанное (одиночное и все сразу)
- Online/offline индикатор
- Health check мониторинг системы (страница /settings)

### Usage

#### Получение уведомлений
Уведомления автоматически приходят в реальном времени через SSE. Если SSE недоступен (>30 сек), приложение автоматически переключается на polling режим.

#### Просмотр уведомлений
- Нажмите на 🔔 в шапке для быстрого просмотра последних уведомлений
- Перейдите на /notifications для полного списка всех уведомлений
- Badge счетчики показывают количество непрочитанных уведомлений

#### Управление уведомлениями
- Отметьте отдельное уведомление как прочитанное нажатием кнопки "Отметить"
- Отметьте все уведомления как прочитанные одной кнопкой

#### Мониторинг состояния
- Проверьте состояние системы на странице /settings (Health Status)
- Следите за online/offline индикатором в навигации
- Если polling режим активен > 5 минут, вы увидите уведомление

### API Integration
Уведомления интегрированы с API через SSE endpoint и REST endpoints:
- `GET /api/v1/notifications/stream` - SSE поток уведомлений (основной метод)
- `GET /api/v1/notifications` - список всех уведомлений
- `GET /api/v1/notifications/unread` - непрочитанные
- `POST /api/v1/notifications/{id}/read` - отметить как прочитанное
- `POST /api/v1/notifications/read-all` - отметить все как прочитанные
- `GET /api/v1/health/notifications` - статус системы (Celery, Redis, SSE)

### Polling Fallback
Когда SSE недоступен (timeout 30 сек), приложение автоматически переключается на polling:
- Проверка каждые 30 секунд
- Уведомление пользователю через 5 минут polling режима
- Автоматическое возвращение на SSE при восстановлении

### Connection Modes
- **SSE** - основной режим, минимальная задержка
- **Polling** - fallback режим, проверка каждые 30 сек
- **Offline** - нет подключения к сети

### Browser Permissions
Для работы browser notifications пользователь должен разрешить их в настройках браузера.
```

**Оценка времени:** 30 мин

---

## Итоговое состояние (после выполнения всех задач)

### Реализовано ✅
- ✅ useNotifications hook с notificationsAPI
- ✅ SSE клиент с fallback логикой (30 сек таймаут → polling)
- ✅ NotificationItem компонент
- ✅ NotificationList компонент
- ✅ NotificationCenter dropdown
- ✅ Страница /notifications
- ✅ Badge счетчики в навигации
- ✅ Mark as read функционал
- ✅ useUnreadNotifications hook
- ✅ useTaskNotifications hook
- ✅ Online/offline индикатор (Sidebar/BottomNavigation)
- ✅ Health check мониторинг (5 минут, страница /settings)
- ✅ Navigation в Sidebar и BottomNavigation
- ✅ Обновленные типы (Notification interface)
- ✅ Тесты компонентов (NotificationItem, NotificationList)
- ✅ Тесты NotificationStream
- ✅ Обновленная документация

### Удалено / Не реализовано (v2.0 решения)
- ❌ NotificationContext (используем React Query напрямую)
- ❌ Фильтрация уведомлений (пока не нужна)
- ❌ Отображение metadata, error_message, delivery_method (скрыты)
- ❌ Кэширование уведомлений для offline режима (только индикатор)

### Интеграция
- ✅ SSE подключен при старте приложения
- ✅ Fallback на polling при SSE недоступности (30 сек)
- ✅ Resilience (reconnect с exponential backoff)
- ✅ LocalStorage для последнего notification ID
- ✅ Browser notifications для SSE событий
- ✅ React Query cache обновляется автоматически
- ✅ Все polling intervals унифицированы на 30 сек
- ✅ Health check каждые 5 минут

---

## Список файлов

### Новые файлы (14)
1. `src/lib/hooks/useNotifications.ts` - React Query hooks
2. `src/lib/hooks/useHealthCheck.ts` - Health check monitoring hook
3. `src/lib/services/NotificationStream.ts` - SSE клиент с fallback
4. `src/components/notifications/NotificationItem.tsx` - Компонент
5. `src/components/notifications/NotificationList.tsx` - Список
6. `src/components/layout/NotificationCenter.tsx` - Dropdown
7. `src/components/layout/ConnectionStatus.tsx` - Online/offline индикатор
8. `src/app/notifications/page.tsx` - Страница уведомлений
9. `src/app/notifications/layout.tsx` - Layout страницы
10. `src/app/settings/page.tsx` - Страница настроек с health status
11. `src/app/settings/layout.tsx` - Layout настроек
12. `src/components/notifications/__tests__/NotificationItem.test.tsx`
13. `src/components/notifications/__tests__/NotificationList.test.tsx`
14. `src/lib/services/__tests__/NotificationStream.test.ts`

### Изменяемые файлы (7)
1. `src/components/NotificationManager.tsx` - Обновить логику (удален NotificationContext)
2. `src/components/layout/Header.tsx` - Добавить NotificationCenter
3. `src/components/layout/BottomNavigation.tsx` - Добавить ссылку и ConnectionStatus
4. `src/components/layout/Sidebar.tsx` - Добавить ссылку, badge, ConnectionStatus
5. `src/types/index.ts` - Обновить типы
6. `src/lib/api/notifications.ts` - Возможно добавить новые методы
7. `README.md` - Обновить документацию

---

## Оценка времени

| Задача | Время |
|--------|-------|
| Задача 1: useNotifications hook | 1 час |
| Задача 2: SSE клиент с fallback | 3-4 часа |
| Задача 3: NotificationItem | 1 час |
| Задача 4: NotificationList | 1.5 часа |
| Задача 5: Страница /notifications | 30 мин |
| Задача 6: NotificationCenter | 1.5 часа |
| Задача 7: Интеграция в Header | 30 мин |
| Задача 8: Обновить NotificationManager | 1 час |
| Задача 9: Online/offline индикатор | 30 мин |
| Задача 10: Health check hook | 1 час |
| Задача 11: Страница /settings | 2 часа |
| Задача 12: Navigation | 1 час |
| Задача 13: Типы | 15 мин |
| Задача 14: Тесты компонентов | 2-3 часа |
| Задача 15: Тесты NotificationStream | 2 часа |
| Задача 16: Документация | 30 мин |
| **Итого** | **18.5-21.5 часов** |

---

## Порядок выполнения

### Этап 1: Критические задачи (обязательно)
1. Задача 1: useNotifications hook
2. Задача 2: SSE клиент с fallback
3. Задача 8: Обновить NotificationManager

### Этап 2: UI компоненты (обязательно)
4. Задача 3: NotificationItem
5. Задача 4: NotificationList
6. Задача 6: NotificationCenter
7. Задача 5: Страница /notifications

### Этап 3: Мониторинг и навигация (обязательно)
8. Задача 9: Online/offline индикатор
9. Задача 10: Health check hook
10. Задача 11: Страница /settings
11. Задача 7: Интеграция в Header
12. Задача 12: Navigation

### Этап 4: Качество и документация (можно параллельно)
13. Задача 13: Типы
14. Задача 14: Тесты компонентов
15. Задача 15: Тесты NotificationStream
16. Задача 16: Документация

---

## Тестирование после завершения

### Manual Testing
```bash
# 1. Запустить dev сервер
npm run dev

# 2. Проверить SSE соединение
# Открыть Console и увидеть "[NotificationStream] Connected"

# 3. Создать задачу с напоминанием через API
curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test notification",
    "reminder_enabled": true,
    "reminder_time": "2026-03-17T12:00:00"
  }'

# 4. Проверить что уведомление пришло
# - В browser notification
# - В NotificationCenter dropdown
# - На странице /notifications

# 5. Проверить mark as read
# - Клик на кнопку "Отметить"
# - Проверить что badge уменьшился

# 6. Проверить mark all as read
# - Клик на "Отметить все как прочитанные"
# - Проверить что badge исчез

# 7. Проверить SSE fallback
# - Остановить API
# - Подождать 30 сек
# - Проверить что переключилось на polling
# - Подождать 5 минут - проверить уведомление
# - Перезапустить API
# - Проверить что вернулось на SSE

# 8. Проверить health check
# - Открыть /settings
# - Проверить статусы всех компонентов
# - Проверить кнопку обновления

# 9. Проверить online/offline индикатор
# - Отключить интернет
# - Проверить индикатор offline
# - Включить интернет
# - Проверить что индикатор исчез
```

### Unit Tests
```bash
# Запустить все тесты
npm test

# Запустить конкретный тест
npm test src/components/notifications/__tests__/NotificationItem.test.tsx

# Запустить с coverage
npm test -- --coverage
```

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

---

## Схема работы системы v2.0

```
┌─────────────────────────────────────────────────────────────────┐
│  API Server (todowka)                                            │
│  ├─ Celery Beat (проверка каждую минуту)                       │
│  ├─ Создает уведомления в БД                                   │
│  ├─ Публикует в Redis Pub/Sub                                  │
│  ├─ SSE endpoint (/api/v1/notifications/stream)                 │
│  └─ Health check (/api/v1/health/notifications)                │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│  NotificationStream (Web Client)                                 │
│  ├─ Подключается к SSE                                          │
│  ├─ Timeout 30 сек → fallback на polling                       │
│  ├─ Polling каждые 30 сек (если SSE недоступен)                 │
│  ├─ Уведомление через 5 мин polling                            │
│  ├─ Показывает browser notification                           │
│  └─ getConnectionMode(): 'sse' | 'polling' | 'disconnected'   │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│  React Query (State Management)                                  │
│  ├─ useNotifications (refetchInterval 30 сек)                   │
│  ├─ useUnreadNotifications (refetchInterval 30 сек)            │
│  ├─ Optimistic updates                                         │
│  └─ Automatic cache invalidation                                │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│  UI Components                                                   │
│  ├─ NotificationCenter (dropdown)                              │
│  ├─ NotificationList (список)                                 │
│  ├─ Badge счетчики в навигации                                │
│  ├─ ConnectionStatus (online/offline индикатор)                │
│  └─ HealthStatus (страница /settings)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Зависимости от API

Перед началом реализации Web Client необходимо, чтобы API был готов:

**Обязательные требования:**
- ✅ SSE endpoint (`GET /api/v1/notifications/stream`)
- ✅ GET /api/v1/notifications
- ✅ GET /api/v1/notifications/unread
- ✅ POST /api/v1/notifications/{id}/read
- ✅ POST /api/v1/notifications/read-all
- ✅ Health check (`GET /api/v1/health/notifications`)

**Опциональные требования:**
- GET /api/v1/notifications/task/{task_id}

---

## Следующие шаги

После завершения этого плана Web Client готов к полноценной работе с уведомлениями. Следующие этапы:
1. **Оптимизация** - WebSocket вместо SSE для двусторонней коммуникации
2. **Улучшения UI** - Анимации, сортировка, фильтрация
3. **Настройки** - Пользовательские предпочтения уведомлений (звуки, типы)
4. **Звуки** - Аудио оповещения
5. **Push Notifications** - Service Worker для фоновых уведомлений
6. **Offline кэширование** - Полная работа без интернета с синхронизацией
7. **Группировка уведомлений** - Объединение похожих уведомлений

---

## Ключевые решения v2.0

### Архитектура
- ✅ Удален NotificationContext (React Query достаточно)
- ✅ SSE с automatic fallback на polling (30 сек timeout)
- ✅ Все polling intervals унифицированы на 30 сек
- ✅ Используется существующий notificationsAPI

### Мониторинг
- ✅ Health check каждые 5 минут
- ✅ Online/offline индикатор в Sidebar/BottomNavigation
- ✅ Health status на странице /settings

### UX
- ✅ Уведомление пользователю через 5 минут polling режима
- ✅ Текст: "Режим реального времени недоступен. Проверьте подключение к интернету."
- ✅ Не отображать metadata, error_message, delivery_method (пока не нужно)
- ✅ Без фильтрации (пока не будет больше данных)

### Обработка ошибок
- ✅ SSE недоступен через 30 сек → polling
- ✅ Тихий fallback без уведомления
- ✅ Уведомление только после > 5 минут polling

---

**Дата создания:** 2026-03-17
**Версия:** 2.0
**Статус:** Готов к реализации (после завершения API плана)
**Отличия от v1.0:** Удален NotificationContext, добавлен SSE fallback, health monitoring, online/offline индикатор
