import { TodoAPIClient } from './client';
import type { Context, ContextCreate, ContextUpdate } from '@/types';

const api = new TodoAPIClient();

export const contextsAPI = {
  async getAll(): Promise<Context[]> {
    return api.get<Context[]>('/contexts');
  },

  async getById(id: number): Promise<Context> {
    return api.get<Context>(`/contexts/${id}`);
  },

  async create(data: ContextCreate): Promise<Context> {
    return api.post<Context>('/contexts', data);
  },

  async update(id: number, data: ContextUpdate): Promise<Context> {
    return api.put<Context>(`/contexts/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/contexts/${id}`);
  }
};
