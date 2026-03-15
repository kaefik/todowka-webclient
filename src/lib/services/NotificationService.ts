class NotificationService {
  private permission: NotificationPermission = 'default';

  async init(): Promise<void> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Notification API not supported');
      return;
    }

    this.permission = window.Notification.permission;

    if (this.permission === 'default') {
      const requested = await this.requestPermission();
      console.log('NotificationService: permission requested, result:', requested);
    }
  }

  canShow(): boolean {
    return this.permission === 'granted';
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }

    const permission = await window.Notification.requestPermission();
    this.permission = permission;
    return permission;
  }

  show(title: string, options: NotificationOptions = {}): void {
    if (!this.canShow()) {
      console.warn('Notification permission not granted');
      return;
    }

    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Notification API not supported');
      return;
    }

    new window.Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });
  }

  showReminder(taskTitle: string, dueDate: string): void {
    const now = Date.now();
    const dueTime = new Date(dueDate).getTime();
    const diffMs = dueTime - now;
    const diffMinutes = Math.floor(diffMs / 60000);

    let timeStr: string;
    if (diffMinutes < 60 && diffMinutes > 0) {
      timeStr = `in ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
    } else if (diffMinutes <= 0) {
      timeStr = 'now';
    } else {
      const date = new Date(dueDate);
      timeStr = `at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    this.show('Task Reminder', {
      body: `"${taskTitle}" is due ${timeStr}`,
      tag: `task-reminder-${taskTitle}`,
      requireInteraction: true
    });
  }
}

export { NotificationService };
export const notificationService = new NotificationService();
