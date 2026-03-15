import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '@/lib/api/tasks';

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, skipRecurrence }: { id: number; skipRecurrence?: boolean }) =>
      tasksAPI.complete(id, skipRecurrence),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'tasks' });
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      queryClient.invalidateQueries({ queryKey: ['nextActions'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      if (data.nextTask) {
        // Optional: show notification about next task creation
        // This can be implemented later with useToast
      }
    },
  });
}
