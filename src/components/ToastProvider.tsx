'use client';

import { useToast } from '@/components/ui/Toast';
import { ToastContainer } from '@/components/ui/Toast';

export function ToastProvider() {
  const { toasts } = useToast();

  return <ToastContainer toasts={toasts} />;
}
