'use client';

import { useEffect } from 'react';
import { useAPIErrorStore } from '@/stores/useAPIErrorStore';
import { setErrorHandler } from '@/lib/api';
import { APIErrorAlert } from './APIErrorAlert';

export function APIErrorHandler() {
  const addError = useAPIErrorStore((state) => state.addError);

  useEffect(() => {
    setErrorHandler((message, status) => {
      addError(message, status);
    });
  }, [addError]);

  return <APIErrorAlert />;
}
