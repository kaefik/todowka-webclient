import { TodoAPIClient } from './client';
import type { Task, InboxCreate } from '@/types';

const api = new TodoAPIClient();

export const inboxAPI = {
  async getAll(): Promise<Task[]> {
    return api.get<Task[]>('/inbox');
  },

  async create(data: InboxCreate): Promise<Task> {
    return api.post<Task>('/inbox', data);
  }
};
