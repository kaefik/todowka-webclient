import { create } from 'zustand';

interface GTDStore {
  inboxCount: number;
  nextActionsCount: number;
  reviewMode: boolean;

  setInboxCount: (count: number) => void;
  setNextActionsCount: (count: number) => void;
  setReviewMode: (enabled: boolean) => void;
}

export const useGTDStore = create<GTDStore>((set) => ({
  inboxCount: 0,
  nextActionsCount: 0,
  reviewMode: false,

  setInboxCount: (inboxCount) => set({ inboxCount }),
  setNextActionsCount: (nextActionsCount) => set({ nextActionsCount }),
  setReviewMode: (reviewMode) => set({ reviewMode }),
}));
