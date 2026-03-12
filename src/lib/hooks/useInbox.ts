'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inboxAPI } from '@/lib/api/inbox';
import type { InboxCreate } from '@/types';

export function useInbox() {
  return useQuery({
    queryKey: ['inbox'],
    queryFn: () => inboxAPI.getAll(),
  });
}

export function useCreateInboxTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InboxCreate) => inboxAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
