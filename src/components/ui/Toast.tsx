'use client';

import { useEffect, useState, useRef } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const show = (message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${toastId++}`;
    setToasts(prev => [...prev, { id, message, type }]);

    const timeout = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      timeoutsRef.current.delete(id);
    }, 5000);

    timeoutsRef.current.set(id, timeout);
  };

  const clear = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
    setToasts([]);
  };

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return { toasts, show, clear };
}

interface ToastContainerProps {
  toasts: Toast[];
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div key={toast.id} className={`p-4 rounded-lg shadow-lg ${
          toast.type === 'error' ? 'bg-red-500 text-white' :
          toast.type === 'success' ? 'bg-green-500 text-white' :
          toast.type === 'warning' ? 'bg-yellow-500 text-white' :
          'bg-slate-700 text-white'
        }`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
