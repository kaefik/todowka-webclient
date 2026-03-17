# Задача: Создать базовую структуру NotificationStream класса

## Описание
Создать класс NotificationStream с базовой структурой, свойствами и методами.

## Файл
`src/lib/services/NotificationStream.ts` (новый)

## Действия
1. Создать интерфейс NotificationData
2. Создать класс NotificationStream
3. Добавить приватные свойства: eventSource, timers, flags
4. Добавить константы: CONNECTION_TIMEOUT, POLLING_NOTIFY_THRESHOLD, RECONNECT_INTERVAL
5. Создать конструктор с инициализацией свойств
6. Добавить методы: setQueryClient, connect, disconnect
7. Добавить метод getConnectionMode

## Код
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
  private isPollingMode = false;

  // Исправлен тип: ReturnType<typeof setTimeout>
  private connectTimeoutTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pollingStartTime: number | null = null;

  private readonly CONNECTION_TIMEOUT = 30000; // 30 сек
  private readonly POLLING_NOTIFY_THRESHOLD = 5 * 60 * 1000; // 5 минут
  private readonly RECONNECT_INTERVAL = 60000; // 1 минута

  private queryClient: any = null;
  private readonly STORAGE_KEY = 'last_notification_id';
  private readonly handlers: Set<(notification: NotificationData) => void> = new Set();

  constructor() {}

  setQueryClient(client: any): void {
    this.queryClient = client;
  }

  connect(): void {
    if (typeof window === 'undefined' || this.eventSource) {
      return;
    }
    // TODO: реализация в следующей задаче
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.connectTimeoutTimer) {
      clearTimeout(this.connectTimeoutTimer);
      this.connectTimeoutTimer = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.isPollingMode = false;
    this.pollingStartTime = null;
  }

  getConnectionMode(): 'sse' | 'polling' | 'disconnected' {
    if (this.isPollingMode) return 'polling';
    if (this.eventSource) return 'sse';
    return 'disconnected';
  }
}

export { NotificationStream };
export const notificationStream = new NotificationStream();
```

## Проверка
- Класс создан и экспортируется
- Экспортируется singleton notificationStream
- Все свойства с правильными типами
- Типы таймеров: ReturnType<typeof setTimeout>
- Методы объявлены

## Оценка
30 минут

## Зависимости
- L0/05-notification-types.md
