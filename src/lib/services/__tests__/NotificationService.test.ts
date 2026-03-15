import { NotificationService } from '../NotificationService';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('init', () => {
    test('init with Notification API support', async () => {
      const mockNotification = {
        permission: 'granted' as NotificationPermission,
        requestPermission: jest.fn().mockResolvedValue('granted')
      };
      global.Notification = mockNotification as any;

      await service.init();

      expect(mockNotification.requestPermission).toHaveBeenCalled();
    });

    test('init without Notification API support', async () => {
      delete (global as any).Notification;

      service = new NotificationService();
      await service.init();

      expect(service.canShow()).toBe(false);
    });

    test('init uses existing permission if already granted', async () => {
      const mockNotification = {
        permission: 'granted' as NotificationPermission,
        requestPermission: jest.fn().mockResolvedValue('granted')
      };
      global.Notification = mockNotification as any;

      await service.init();

      expect(mockNotification.requestPermission).not.toHaveBeenCalled();
      expect(service.canShow()).toBe(true);
    });
  });

  describe('canShow', () => {
    test('canShow returns true when permission granted', () => {
      (service as any).permission = 'granted';

      expect(service.canShow()).toBe(true);
    });

    test('canShow returns false when permission denied', () => {
      (service as any).permission = 'denied';

      expect(service.canShow()).toBe(false);
    });

    test('canShow returns false when permission is default', () => {
      (service as any).permission = 'default';

      expect(service.canShow()).toBe(false);
    });
  });

  describe('requestPermission', () => {
    test('requestPermission calls API and returns result', async () => {
      const mockNotification = {
        requestPermission: jest.fn().mockResolvedValue('granted')
      };
      global.Notification = mockNotification as any;

      const result = await service.requestPermission();

      expect(result).toBe('granted');
      expect(service.canShow()).toBe(true);
    });

    test('requestPermission returns denied when API not supported', async () => {
      delete (global as any).Notification;

      service = new NotificationService();
      const result = await service.requestPermission();

      expect(result).toBe('denied');
    });
  });

  describe('show', () => {
    test('show displays notification when permitted', () => {
      const mockNotification = jest.fn();
      global.Notification = mockNotification as any;
      (global as any).Notification.permission = 'granted';

      service.show('Test Title', { body: 'Test Body' });

      expect(mockNotification).toHaveBeenCalledWith('Test Title', expect.objectContaining({
        body: 'Test Body',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      }));
    });

    test('show logs warning when not permitted', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      (service as any).permission = 'denied';

      service.show('Test Title');

      expect(consoleWarnSpy).toHaveBeenCalledWith('Notification permission not granted');
      consoleWarnSpy.mockRestore();
    });

    test('show logs warning when API not supported', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      delete (global as any).Notification;

      service = new NotificationService();
      service.show('Test Title');

      expect(consoleWarnSpy).toHaveBeenCalledWith('Notification API not supported');
      consoleWarnSpy.mockRestore();
    });
  });

  describe('showReminder', () => {
    test('showReminder formats time correctly for minutes', () => {
      const mockNotification = jest.fn();
      global.Notification = mockNotification as any;
      (global as any).Notification.permission = 'granted';

      const dueDate = new Date();
      dueDate.setMinutes(dueDate.getMinutes() + 30);

      service.showReminder('Test Task', dueDate.toISOString());

      expect(mockNotification).toHaveBeenCalledWith(
        'Task Reminder',
        expect.objectContaining({
          body: expect.stringContaining('in 30 minutes'),
          tag: 'task-reminder-Test Task',
          requireInteraction: true
        })
      );
    });

    test('showReminder formats time correctly for hours', () => {
      const mockNotification = jest.fn();
      global.Notification = mockNotification as any;
      (global as any).Notification.permission = 'granted';

      const dueDate = new Date();
      dueDate.setHours(dueDate.getHours() + 2);

      service.showReminder('Test Task', dueDate.toISOString());

      expect(mockNotification).toHaveBeenCalledWith(
        'Task Reminder',
        expect.objectContaining({
          body: expect.stringContaining('at'),
          tag: 'task-reminder-Test Task',
          requireInteraction: true
        })
      );
    });

    test('showReminder formats time as now when due time passed', () => {
      const mockNotification = jest.fn();
      global.Notification = mockNotification as any;
      (global as any).Notification.permission = 'granted';

      const dueDate = new Date();
      dueDate.setMinutes(dueDate.getMinutes() - 30);

      service.showReminder('Test Task', dueDate.toISOString());

      expect(mockNotification).toHaveBeenCalledWith(
        'Task Reminder',
        expect.objectContaining({
          body: expect.stringContaining('now'),
          tag: 'task-reminder-Test Task',
          requireInteraction: true
        })
      );
    });

    test('showReminder uses singular minute for 1 minute', () => {
      const mockNotification = jest.fn();
      global.Notification = mockNotification as any;
      (global as any).Notification.permission = 'granted';

      const dueDate = new Date();
      dueDate.setMinutes(dueDate.getMinutes() + 1);

      service.showReminder('Test Task', dueDate.toISOString());

      expect(mockNotification).toHaveBeenCalledWith(
        'Task Reminder',
        expect.objectContaining({
          body: expect.stringContaining('in 1 minute'),
          tag: 'task-reminder-Test Task',
          requireInteraction: true
        })
      );
    });
  });
});
