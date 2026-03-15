import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '@/lib/api/tasks';

export function useSetReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reminderTime, enabled }: { id: number; reminderTime: string | null; enabled: boolean }) =>
      tasksAPI.setReminder(id, reminderTime, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
