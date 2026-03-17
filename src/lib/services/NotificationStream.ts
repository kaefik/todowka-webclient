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

  private connectTimeoutTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pollingStartTime: number | null = null;

  private readonly CONNECTION_TIMEOUT = 30000;
  private readonly POLLING_NOTIFY_THRESHOLD = 5 * 60 * 1000;
  private readonly RECONNECT_INTERVAL = 60000;

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

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/stream`;

    this.eventSource = new EventSource(url);

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

  getConnectionMode(): 'sse' | 'polling' | 'disconnected' {
    if (this.isPollingMode) return 'polling';
    if (this.eventSource) return 'sse';
    return 'disconnected';
  }
}

export { NotificationStream };
export const notificationStream = new NotificationStream();
