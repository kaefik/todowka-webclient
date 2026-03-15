import { create } from 'zustand';

interface APIError {
  message: string;
  status: number;
  timestamp: number;
}

interface APIErrorStore {
  errors: APIError[];
  addError: (message: string, status: number) => void;
  clearErrors: () => void;
  removeError: (timestamp: number) => void;
}

export const useAPIErrorStore = create<APIErrorStore>((set) => ({
  errors: [],
  
  addError: (message, status) => set((state) => ({
    errors: [
      ...state.errors.filter((error) => 
        error.message !== message || (Date.now() - error.timestamp > 5000)
      ),
      { message, status, timestamp: Date.now() }
    ].slice(-3)
  })),
  
  clearErrors: () => set({ errors: [] }),
  
  removeError: (timestamp) => set((state) => ({
    errors: state.errors.filter((error) => error.timestamp !== timestamp)
  })),
}));
