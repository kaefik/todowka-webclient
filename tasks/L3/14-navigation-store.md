# L3-14 — Create Navigation store (Zustand)

## Goal

Implement Zustand store for navigation UI state.

## Input

Task L1-04 completed.

## Output

`src/stores/useNavigationStore.ts` with NavigationStore.

## Implementation

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavigationStore {
  // State
  currentPage: string;
  sidebarOpen: boolean;

  // Actions
  setCurrentPage: (page: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set) => ({
      // Initial state
      currentPage: '/',
      sidebarOpen: true,

      // Actions
      setCurrentPage: (currentPage) => set({ currentPage }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: 'todo-navigation-storage',
    }
  )
);
```

## Done When

- Store implements all state and actions
- Sidebar state persists to localStorage
- Store works in components

## Effort

S (1 hour)

## Depends On

L1-04
