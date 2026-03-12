import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavigationStore {
  currentPage: string;
  sidebarOpen: boolean;

  setCurrentPage: (page: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set) => ({
      currentPage: '/',
      sidebarOpen: true,

      setCurrentPage: (currentPage) => set({ currentPage }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: 'todo-navigation-storage',
    }
  )
);
