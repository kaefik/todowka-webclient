# Задача: Создать тесты для NotificationStream

## Описание
Создать unit тесты для NotificationStream сервиса с имитацией EventSource.

## Файл
`src/lib/services/__tests__/NotificationStream.test.ts` (новый)

## Действия
1. Создать директорию __tests__ в lib/services
2. Создать NotificationStream.test.ts
3. Mock EventSource глобально
4. Mock notificationService
5. Mock useNotifications hook
6. Тест: initializes with disconnected status
7. Тест: connects to SSE on connect()
8. Тест: invalidates cache on SSE message
9. Тест: disconnects properly
10. Тест: switches to polling on error
11. Тест: schedules reconnect

## Код:
```typescript
import { NotificationStream } from '../NotificationStream';
import { notificationService } from '../NotificationService';

jest.mock('../NotificationService');
jest.mock('@/lib/hooks/useNotifications');

// Mock EventSource
global.EventSource = jest.fn().mockImplementation((url: string) => {
  const mockEventSource = {
    url,
    readyState: 0,
    onopen: null,
    onmessage: null,
    onerror: null,
    close: jest.fn(),
  };

  setTimeout(() => {
    if (mockEventSource.onopen) {
      mockEventSource.onopen({} as Event);
    }
  }, 100);

  return mockEventSource;
});

describe('NotificationStream', () => {
  let stream: NotificationStream;
  let mockQueryClient: any;

  beforeEach(() => {
    stream = new NotificationStream();
    mockQueryClient = {
      invalidateQueries: jest.fn(),
      getQueryCache: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          observers: [
            {
              refetch: jest.fn(),
            },
          ],
        }),
      }),
    };
    stream.setQueryClient(mockQueryClient);
    jest.clearAllMocks();
  });

  afterEach(() => {
    stream.disconnect();
  });

  it('initializes with disconnected status', () => {
    expect(stream.getConnectionMode()).toBe('disconnected');
  });

  it('connects to SSE on connect()', (done) => {
    stream.connect();

    setTimeout(() => {
      expect(stream.getConnectionMode()).toBe('sse');
      done();
    }, 150);
  });

  it('invalidates cache on SSE message', (done) => {
    stream.connect();

    setTimeout(() => {
      const mockEventSource = (global.EventSource as jest.Mock).mock.results[0].value;
      const mockMessage = {
        data: JSON.stringify({
          id: 1,
          message: 'Test',
          status: 'sent',
          created_at: '2026-03-17T10:00:00',
        }),
      };

      if (mockEventSource.onmessage) {
        mockEventSource.onmessage(mockMessage as MessageEvent);
      }

      expect(mockQueryClient.invalidateQueries).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('disconnects properly', () => {
    stream.connect();
    stream.disconnect();
    expect(stream.getConnectionMode()).toBe('disconnected');
  });

  it('switches to polling on SSE error', (done) => {
    stream.connect();

    setTimeout(() => {
      const mockEventSource = (global.EventSource as jest.Mock).mock.results[0].value;

      if (mockEventSource.onerror) {
        mockEventSource.onerror({} as Event);
      }

      setTimeout(() => {
        expect(stream.getConnectionMode()).toBe('polling');
        done();
      }, 50);
    }, 100);
  });

  it('schedules reconnect when switching to polling', (done) => {
    stream.connect();

    setTimeout(() => {
      const mockEventSource = (global.EventSource as jest.Mock).mock.results[0].value;

      if (mockEventSource.onerror) {
        mockEventSource.onerror({} as Event);
      }

      setTimeout(() => {
        expect(stream.getConnectionMode()).toBe('polling');
        expect(setTimeout).toHaveBeenCalled();
        done();
      }, 50);
    }, 100);
  });
});
```

## Проверка
- Тест файл создан
- EventSource mock правильный
- Все тесты проходят
- Async тесты с done() работают
- Таймауты адекватные

## Оценка
2.5 часа

## Зависимости
- L1/05-notificationstream-reconnection.md
