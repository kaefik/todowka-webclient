import { TodoAPIClient } from './client';
import type { Area, AreaCreate, AreaUpdate } from '@/types';

const api = new TodoAPIClient();

export const areasAPI = {
  async getAll(): Promise<Area[]> {
    return api.get<Area[]>('/areas');
  },

  async getById(id: number): Promise<Area> {
    return api.get<Area>(`/areas/${id}`);
  },

  async create(data: AreaCreate): Promise<Area> {
    return api.post<Area>('/areas', data);
  },

  async update(id: number, data: AreaUpdate): Promise<Area> {
    return api.put<Area>(`/areas/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/areas/${id}`);
  }
};
