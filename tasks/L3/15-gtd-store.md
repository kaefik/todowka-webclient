# L3-15 — Create GTD store (Zustand)

## Goal

Implement Zustand store for GTD-specific state.

## Input

Task L1-04 completed.

## Output

`src/stores/useGTDStore.ts` with GTDStore.

## Implementation

```typescript
import { create } from 'zustand';

interface GTDStore {
  // State
  inboxCount: number;
  nextActionsCount: number;
  reviewMode: boolean;

  // Actions
  setInboxCount: (count: number) => void;
  setNextActionsCount: (count: number) => void;
  setReviewMode: (enabled: boolean) => void;
}

export const useGTDStore = create<GTDStore>((set) => ({
  // Initial state
  inboxCount: 0,
  nextActionsCount: 0,
  reviewMode: false,

  // Actions
  setInboxCount: (inboxCount) => set({ inboxCount }),
  setNextActionsCount: (nextActionsCount) => set({ nextActionsCount }),
  setReviewMode: (reviewMode) => set({ reviewMode }),
}));
```

## Done When

- Store implements all state and actions
- Store works in components

## Effort

S (1 hour)

## Depends On

L1-04
