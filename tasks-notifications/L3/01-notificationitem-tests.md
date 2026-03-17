# Задача: Создать тесты для NotificationItem

## Описание
Создать unit тесты для NotificationItem компонента с использованием Jest и React Testing Library.

## Файл
`src/components/notifications/__tests__/NotificationItem.test.tsx` (новый)

## Действия
1. Создать директорию __tests__ в components/notifications
2. Создать NotificationItem.test.tsx
3. Импортировать render, screen, fireEvent
4. Создать mockNotification объект
5. Тест: renders notification message
6. Тест: shows task ID
7. Тест: shows unread styling when not read
8. Тест: shows read styling when read
9. Тест: calls onRead when button clicked
10. Тест: does not show error_message in UI

## Код:
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

## Проверка
- Тест файл создан
- Все тесты проходят
- Mock данные корректные
- fireEvent используется правильно
- Проверка на отсутствие error_message

## Оценка
1.5 часа

## Зависимости
- L1/06-notification-item-component.md
