# План внедрения оповещений пользователей - Web Client (todowka-webclient)

**Дата:** 2026-03-17
**Проект:** todowka-webclient (Next.js)
**Цель:** Полнофункциональная система получения и отображения уведомлений с real-time поддержкой

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

## Цель

Создать полнофункциональную систему получения и отображения уведомлений с real-time поддержкой через SSE.

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
    refetchInterval: 30000, // Polling пока нет SSE
    staleTime: 10000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/${id}/read`, {
        method: 'POST',
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/read-all`, {
        method: 'POST',
      }).then(res => res.json()),
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
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/unread`)
        .then(res => res.json()),
    refetchInterval: 10000, // Частее обновление для непрочитанных
  });
}

export function useTaskNotifications(taskId: number) {
  return useQuery({
    queryKey: ['notifications', 'task', taskId],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/task/${taskId}`)
        .then(res => res.json()),
    enabled: !!taskId,
  });
}
```

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

### 📌 Задача 2: Создать SSE клиент

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

class NotificationStream {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private isConnecting = false;

  private readonly STORAGE_KEY = 'last_notification_id';
  private readonly handlers: Set<(notification: NotificationData) => void> = new Set();

  connect(): void {
    if (typeof window === 'undefined' || this.eventSource) {
      return;
    }

    this.isConnecting = true;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/stream`;

    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      console.log('[NotificationStream] Connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
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

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, this.reconnectDelay);
      }
    };
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnecting = false;
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
}

export { NotificationStream };
export const notificationStream = new NotificationStream();
```

**Проверка работы:**
```typescript
// В компоненте
import { notificationStream } from '@/lib/services/NotificationStream';

useEffect(() => {
  const unsubscribe = notificationStream.onNotification((notification) => {
    console.log('New notification:', notification);
  });

  notificationStream.connect();

  return () => {
    unsubscribe();
    notificationStream.disconnect();
  };
}, []);
```

**Оценка времени:** 2-3 часа

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
          {notification.error && (
            <p className="text-sm text-red-600 mt-1">
              Ошибка: {notification.error}
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

# Проверить чтоNotificationCenter отображается в Header
# Клик на иконку должен открывать dropdown
```

**Оценка времени:** 30 мин

---

### 📌 Задача 8: Создать NotificationContext для глобального состояния

**Создать файл:** `src/contexts/NotificationContext.tsx`

**Содержимое:**
```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { notificationStream } from '@/lib/services/NotificationStream';

interface NotificationData {
  id: number;
  message: string;
  task_id?: number;
  status: string;
  scheduled_at: string;
  created_at: string;
}

interface NotificationContextType {
  isConnected: boolean;
  unreadCount: number;
  lastNotification: NotificationData | null;
}

const NotificationContext = createContext<NotificationContextType>({
  isConnected: false,
  unreadCount: 0,
  lastNotification: null,
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastNotification, setLastNotification] = useState<NotificationData | null>(null);

  useEffect(() => {
    const unsubscribe = notificationStream.onNotification((notification) => {
      if (!notification.read) {
        setUnreadCount(prev => prev + 1);
      }
      setLastNotification(notification);
    });

    notificationStream.connect();
    setIsConnected(true);

    return () => {
      unsubscribe();
      notificationStream.disconnect();
      setIsConnected(false);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ isConnected, unreadCount, lastNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(NotificationContext);
}
```

**Интегрировать в layout:** Изменить `src/app/layout.tsx`
```typescript
import { NotificationProvider } from '@/contexts/NotificationContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
```

**Оценка времени:** 1 час

---

### 📌 Задача 9: Обновить NotificationManager

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
      console.log('[NotificationManager] Received notification:', notification);
    });

    notificationStream.connect();

    return () => {
      unsubscribe();
      notificationStream.disconnect();
    };
  }, []);

  // Резервный polling для проверки напоминаний
  // (если SSE не работает или для совместимости с существующей логикой)
  const checkReminders = () => {
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
    intervalRef.current = setInterval(checkReminders, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [tasks]);

  return null;
}
```

**Важно:** Удалены все console.log или перенесены в условный блок с флагом DEBUG

**Оценка времени:** 1 час

---

### 📌 Задача 10: Добавить Navigation для страницы уведомлений

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
```

**Проверка работы:**
```bash
# На мобильном устройстве проверить BottomNavigation
# На десктопе проверить Sidebar
```

**Оценка времени:** 30 мин

---

### 📌 Задача 11: Обновить типы

**Изменить файл:** `src/types/index.ts`

**Обновить интерфейс Notification:**
```typescript
export interface Notification {
  id: number;
  message: string;
  task_id?: number;
  status: NotificationStatus;
  scheduled_at?: string;
  sent_at?: string;
  error?: string;
  delivery_method?: string;
  read?: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
```

**Оценка времени:** 15 мин

---

### 📌 Задача 12: Добавить тесты для компонентов

**Создать файл:** `src/components/notifications/__tests__/NotificationItem.test.tsx`
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationItem } from '../NotificationItem';
import { Notification } from '@/types';

const mockNotification: Notification = {
  id: 1,
  message: 'Test notification',
  task_id: 1,
  status: 'pending',
  scheduled_at: '2026-03-17T12:00:00',
  created_at: '2026-03-17T10:00:00',
  read: false,
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
        message: 'Test notification',
        task_id: 1,
        status: 'pending',
        created_at: '2026-03-17T10:00:00',
        read: false,
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

### 📌 Задача 13: Активировать Toast уведомления

**Изменить файл:** `src/components/ToastProvider.tsx`

**Активировать использование:**
```typescript
// Добавить экспорт для глобального доступа
export function useToast() {
  return useContext(ToastContext);
}
```

**Обновить NotificationManager:**
```typescript
import { useToast } from '@/components/ToastProvider';

export function NotificationManager() {
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = notificationStream.onNotification((notification) => {
      toast.show(notification.message, { type: 'info' });
    });

    notificationStream.connect();

    return () => {
      unsubscribe();
      notificationStream.disconnect();
    };
  }, [toast]);

  return null;
}
```

**Оценка времени:** 30 мин

---

### 📌 Задача 14: Обновить документацию

**Обновить файл:** `README.md`

**Добавить секцию:**
```markdown
## Уведомления

### Features
- Real-time уведомления через SSE
- Browser notifications (если разрешено пользователем)
- Центр уведомлений с фильтрами
- Badge счетчики в навигации
- Отметка как прочитанное
- История всех уведомлений на странице /notifications

### Usage

#### Получение уведомлений
Уведомления автоматически приходят в реальном времени, когда напоминание сработало.

#### Просмотр уведомлений
- Нажмите на 🔔 в шапке для быстрого просмотра последних уведомлений
- Перейдите на /notifications для полного списка всех уведомлений
- Badge счетчики показывают количество непрочитанных уведомлений

#### Управление уведомлениями
- Отметьте отдельное уведомление как прочитанное нажатием кнопки "Отметить"
- Отметьте все уведомления как прочитанные одной кнопкой
- Фильтруйте уведомления по статусу (pending, sent, failed)

### API Integration
Уведомления интегрированы с API через SSE endpoint:
- `GET /api/v1/notifications/stream` - SSE поток уведомлений
- `GET /api/v1/notifications` - список всех уведомлений
- `GET /api/v1/notifications/unread` - непрочитанные
- `POST /api/v1/notifications/{id}/read` - отметить как прочитанное

### Browser Permissions
Для работы browser notifications пользователь должен разрешить их в настройках браузера.
```

**Оценка времени:** 30 мин

---

## Итоговое состояние (после выполнения всех задач)

### Реализовано ✅
- ✅ useNotifications hook
- ✅ SSE клиент для real-time
- ✅ NotificationItem компонент
- ✅ NotificationList компонент
- ✅ NotificationCenter dropdown
- ✅ Страница /notifications
- ✅ Badge счетчики
- ✅ Mark as read функционал
- ✅ Фильтрация по непрочитанным
- ✅ useUnreadNotifications hook
- ✅ useTaskNotifications hook
- ✅ NotificationContext для глобального состояния
- ✅ Navigation в Sidebar и BottomNavigation
- ✅ Обновленные типы
- ✅ Тесты компонентов
- ✅ Toast уведомления
- ✅ Убраны console.log из production
- ✅ Обновленная документация

### Интеграция
- ✅ SSE подключен при старте приложения
- ✅ Resilience (reconnect с backoff)
- ✅ LocalStorage для последнего notification ID
- ✅ Browser notifications для SSE событий
- ✅ React Query cache обновляется автоматически

---

## Список файлов

### Новые файлы (12)
1. `src/lib/hooks/useNotifications.ts` - React Query hooks
2. `src/lib/services/NotificationStream.ts` - SSE клиент
3. `src/components/notifications/NotificationItem.tsx` - Компонент
4. `src/components/notifications/NotificationList.tsx` - Список
5. `src/components/layout/NotificationCenter.tsx` - Dropdown
6. `src/contexts/NotificationContext.tsx` - Context
7. `src/app/notifications/page.tsx` - Страница
8. `src/app/notifications/layout.tsx` - Layout страницы
9. `src/components/notifications/__tests__/NotificationItem.test.tsx`
10. `src/components/notifications/__tests__/NotificationList.test.tsx`
11. `src/components/notifications/__tests__/NotificationCenter.test.tsx`

### Изменяемые файлы (8)
1. `src/components/NotificationManager.tsx` - Обновить логику
2. `src/components/layout/Header.tsx` - Добавить NotificationCenter
3. `src/components/layout/BottomNavigation.tsx` - Добавить ссылку
4. `src/components/layout/Sidebar.tsx` - Добавить ссылку
5. `src/components/ToastProvider.tsx` - Активировать
6. `src/app/layout.tsx` - Добавить NotificationProvider
7. `src/types/index.ts` - Обновить типы
8. `README.md` - Обновить документацию

---

## Оценка времени

| Задача | Время |
|--------|-------|
| Задача 1: useNotifications hook | 1 час |
| Задача 2: SSE клиент | 2-3 часа |
| Задача 3: NotificationItem | 1 час |
| Задача 4: NotificationList | 1.5 часа |
| Задача 5: Страница /notifications | 30 мин |
| Задача 6: NotificationCenter | 1.5 часа |
| Задача 7: Интеграция в Header | 30 мин |
| Задача 8: NotificationContext | 1 час |
| Задача 9: Обновить NotificationManager | 1 час |
| Задача 10: Navigation | 30 мин |
| Задача 11: Типы | 15 мин |
| Задача 12: Тесты | 2-3 часа |
| Задача 13: Toast | 30 мин |
| Задача 14: Документация | 30 мин |
| **Итого** | **13-16.5 часов** |

---

## Порядок выполнения

### Этап 1: Критические задачи (обязательно)
1. Задача 1: useNotifications hook
2. Задача 2: SSE клиент
3. Задача 8: NotificationContext
4. Задача 9: Обновить NotificationManager

### Этап 2: UI компоненты (обязательно)
5. Задача 3: NotificationItem
6. Задача 4: NotificationList
7. Задача 6: NotificationCenter
8. Задача 5: Страница /notifications

### Этап 3: Интеграция и навигация (обязательно)
9. Задача 7: Интеграция в Header
10. Задача 10: Navigation
11. Задача 11: Типы

### Этап 4: Качество и документация (можно параллельно)
12. Задача 12: Тесты
13. Задача 13: Toast
14. Задача 14: Документация

---

## Тестирование после завершения

### Manual Testing
```bash
# 1. Запустить dev сервер
npm run dev

# 2. Проверить NotificationContext
# Открыть React DevTools и проверить Context

# 3. Проверить SSE соединение
# Открыть Console и увидеть "[NotificationStream] Connected"

# 4. Создать задачу с напоминанием через API
curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test notification",
    "reminder_enabled": true,
    "reminder_time": "2026-03-17T12:00:00"
  }'

# 5. Проверить что уведомление пришло
# - В browser notification
# - В NotificationCenter dropdown
# - На странице /notifications

# 6. Проверить mark as read
# - Клик на кнопку "Отметить"
# - Проверить что badge уменьшился

# 7. Проверить mark all as read
# - Клик на "Отметить все как прочитанные"
# - Проверить что badge исчез

# 8. Проверить SSE reconnect
# - Остановить API
# - Подождать пока переподключится
# - Перезапустить API
# - Проверить что новые уведомления приходят
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

## Схема работы системы

```
┌─────────────────────────────────────────────────────────────────┐
│  Celery Beat (API)                                             │
│  ├─ Проверяет задачи каждую минуту                            │
│  ├─ Создает уведомление в БД                                  │
│  └─ Уведомление доступно в SSE потоке                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  SSE Endpoint (API)                                            │
│  └─ Отправляет уведомления клиентам в реальном времени       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  NotificationStream (Web Client)                               │
│  ├─ Подключается к SSE (в NotificationManager)                │
│  ├─ Получает уведомления                                      │
│  ├─ Показывает browser notification                           │
│  ├─ Обновляет NotificationContext                             │
│  └─ Инвалидирует React Query cache                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  UI Components                                                 │
│  ├─ NotificationCenter (dropdown)                            │
│  ├─ NotificationList (список)                                 │
│  ├─ Badge счетчики в навигации                                │
│  └─ Страница /notifications                                   │
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

**Опциональные требования:**
- GET /api/v1/notifications/task/{task_id}

---

## Следующие шаги

После завершения этого плана Web Client готов к полноценной работе с уведомлениями. Следующие этапы:

1. **Оптимизация** - WebSocket вместо SSE для двусторонней коммуникации
2. **Улучшения UI** - Анимации, сортировка, фильтрация
3. **Настройки** - Пользовательские предпочтения уведомлений
4. **Звуки** - Аудио оповещения
5. **Push Notifications** - Service Worker для фоновых уведомлений

---

**Дата создания:** 2026-03-17
**Статус:** Готов к реализации (после завершения API плана)
