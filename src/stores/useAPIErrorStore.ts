import { create } from 'zustand';

interface APIError {
  message: string;
  status: number;
  id: string;
  timestamp: number;
}

interface APIErrorStore {
  errors: APIError[];
  addError: (message: string, status: number) => void;
  clearErrors: () => void;
  removeError: (id: string) => void;
}

let errorCounter = 0;

export const useAPIErrorStore = create<APIErrorStore>((set) => ({
  errors: [],
  
  addError: (message, status) => set((state) => ({
    errors: [
      ...state.errors.filter((error) => 
        error.message !== message || (Date.now() - error.timestamp > 5000)
      ),
      { message, status, id: `${Date.now()}-${++errorCounter}`, timestamp: Date.now() }
    ].slice(-3)
  })),
  
  clearErrors: () => set({ errors: [] }),
  
  removeError: (id) => set((state) => ({
    errors: state.errors.filter((error) => error.id !== id)
  })),
}));
