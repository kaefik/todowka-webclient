import { create } from 'zustand';
import type { Task, TaskFilters } from '@/types';

interface TaskStore {
  selectedTask: Task | null;
  filters: TaskFilters;
  viewMode: 'list' | 'card';

  selectTask: (task: Task | null) => void;
  setFilters: (filters: TaskFilters) => void;
  setViewMode: (mode: 'list' | 'card') => void;
  clearFilters: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  selectedTask: null,
  filters: {},
  viewMode: 'list',

  selectTask: (task) => set({ selectedTask: task }),
  setFilters: (filters) => set({ filters }),
  setViewMode: (viewMode) => set({ viewMode }),
  clearFilters: () => set({ filters: {} }),
}));
