import { getAPIClient } from './index';
import type { Notification } from '@/types';

const api = getAPIClient();

export const notificationsAPI = {
  async getAll(): Promise<Notification[]> {
    return api.get<Notification[]>('/notifications');
  },

  async getUnread(): Promise<Notification[]> {
    return api.get<Notification[]>('/notifications/unread');
  },

  async markAsRead(id: number): Promise<void> {
    return api.post(`/notifications/${id}/read`, {});
  },

  async markAllAsRead(): Promise<void> {
    return api.post('/notifications/read-all', {});
  },

  async getById(id: number): Promise<Notification> {
    return api.get<Notification>(`/notifications/${id}`);
  },

  async update(id: number, data: any): Promise<Notification> {
    return api.put<Notification>(`/notifications/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/notifications/${id}`);
  }
};
