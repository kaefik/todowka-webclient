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
