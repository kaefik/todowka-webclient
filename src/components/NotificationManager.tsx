'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { notificationStream } from '@/lib/services/NotificationStream';
import { notificationService } from '@/lib/services/NotificationService';

export function NotificationManager() {
  const queryClient = useQueryClient();

  useEffect(() => {
    notificationService.init();
    notificationStream.setQueryClient(queryClient);

    notificationStream.connect();

    const unsubscribe = notificationStream.onNotification((notification) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[NotificationManager] Received SSE notification:', notification);
      }
    });

    return () => {
      unsubscribe();
      notificationStream.disconnect();
    };
  }, [queryClient]);

  return null;
}
