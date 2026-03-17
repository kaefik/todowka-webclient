import { render, screen } from '@testing-library/react';
import { NotificationList } from '../NotificationList';
import { Notification } from '@/types';

const mockNotifications: Notification[] = [
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
];

jest.mock('@/lib/hooks/useNotifications', () => ({
  useNotifications: () => ({
    notifications: mockNotifications,
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

  it('shows loading state', () => {
    jest.doMock('@/lib/hooks/useNotifications', () => ({
      useNotifications: () => ({
        notifications: [],
        isLoading: true,
        error: null,
        markAsRead: jest.fn(),
        markAllAsRead: jest.fn(),
      }),
    }));

    render(<NotificationList />);
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    jest.doMock('@/lib/hooks/useNotifications', () => ({
      useNotifications: () => ({
        notifications: [],
        isLoading: false,
        error: null,
        markAsRead: jest.fn(),
        markAllAsRead: jest.fn(),
      }),
    }));

    render(<NotificationList />);
    expect(screen.getByText('Нет уведомлений')).toBeInTheDocument();
  });

  it('shows error state', () => {
    jest.doMock('@/lib/hooks/useNotifications', () => ({
      useNotifications: () => ({
        notifications: [],
        isLoading: false,
        error: new Error('Test error'),
        markAsRead: jest.fn(),
        markAllAsRead: jest.fn(),
      }),
    }));

    render(<NotificationList />);
    expect(screen.getByText('Ошибка загрузки уведомлений')).toBeInTheDocument();
  });
});
