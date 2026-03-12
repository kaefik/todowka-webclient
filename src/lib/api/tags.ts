import { TodoAPIClient } from './client';
import type { Tag, TagCreate, TagUpdate } from '@/types';

const api = new TodoAPIClient();

export const tagsAPI = {
  async getAll(): Promise<Tag[]> {
    return api.get<Tag[]>('/tags');
  },

  async getById(id: number): Promise<Tag> {
    return api.get<Tag>(`/tags/${id}`);
  },

  async create(data: TagCreate): Promise<Tag> {
    return api.post<Tag>('/tags', data);
  },

  async update(id: number, data: TagUpdate): Promise<Tag> {
    return api.put<Tag>(`/tags/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/tags/${id}`);
  }
};
