import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '@/lib/api/tasks';
import type { RecurrenceType, RecurrenceConfig } from '@/types';

export function useSetRecurrence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, type, config }: { id: number; type: RecurrenceType | null; config: RecurrenceConfig | null }) =>
      tasksAPI.setRecurrence(id, type, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
