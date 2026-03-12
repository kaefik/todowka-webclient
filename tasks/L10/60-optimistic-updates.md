# L10-60 — Add optimistic updates

## Goal

Implement optimistic UI updates for better UX.

## Input

Task L7-38, L7-39, L7-40 completed.

## Output

Optimistic updates in mutation hooks (create, update, delete).

## Implementation

Update hooks to include optimistic updates:

**useCreateTask:**

```typescript
export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskCreate) => tasksAPI.create(data),
    onMutate: async (newTask) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(['tasks']);

      // Optimistically update
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        return [
          {
            ...newTask,
            id: Date.now(), // Temporary ID
            status: newTask.status || 'inbox',
            priority: newTask.priority || 'medium',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tag_ids: [],
            is_next_action: false,
          } as Task,
          ...(old || []),
        ];
      });

      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      // Rollback on error
      queryClient.setQueryData(['tasks'], (context as any)?.previousTasks);
    },
    onSettled: () => {
      // Refetch after settle
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

**useUpdateTask:**

```typescript
export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskUpdate }) =>
      tasksAPI.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        return (old || []).map(task =>
          task.id === id ? { ...task, ...data, updated_at: new Date().toISOString() } : task
        );
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['tasks'], (context as any)?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

**useDeleteTask:**

```typescript
export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tasksAPI.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        return (old || []).filter(task => task.id !== id);
      });

      return { previousTasks };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['tasks'], (context as any)?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

**Similar patterns for:**
- useCreateProject, useUpdateProject, useDeleteProject
- useCreateInboxTask

## Done When

- UI updates immediately on mutations
- Rolls back on error
- Refetches after settle

## Effort

L (4 hours)

## Depends On

L7-38, L7-39, L7-40
