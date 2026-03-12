# L10-59 — Add loading states

## Goal

Implement loading spinners/skeletons throughout the app.

## Input

Task L4-25 completed.

## Output

Loading states in all lists, forms, and pages.

## Implementation

Update components to show loading state:

**TaskList component:**

```typescript
import { Spinner } from '@/components/ui/Spinner';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  // ... other props
}

export function TaskList({ tasks, loading, ...otherProps }: TaskListProps) {
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyState ... />;
  }

  return <div className="space-y-3">{tasks.map(...)}</div>;
}
```

**ProjectList component:**

```typescript
export function ProjectList({ projects, loading, ...otherProps }: ProjectListProps) {
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (projects.length === 0) {
    return <EmptyState ... />;
  }

  return <div className="grid...">{projects.map(...)}</div>;
}
```

**Pages update:**

```typescript
export default function TasksPage() {
  const { data: tasks, isLoading } = useTasks(filters);

  return (
    <div className="space-y-6">
      <TaskList tasks={tasks || []} loading={isLoading} ... />
    </div>
  );
}
```

**Mutation loading states in forms:**

```typescript
export function TaskForm({ task, onSubmit, ... }: TaskFormProps) {
  const { mutate, isPending } = useCreateTask();

  return (
    <form onSubmit={handleSubmit(data => mutate(data))}>
      {/* fields */}
      <Button type="submit" disabled={isPending}>
        {isPending ? <Spinner size="sm" /> : 'Create Task'}
      </Button>
    </form>
  );
}
```

## Done When

- Spinner shows while loading data
- Form buttons show loading spinner during mutations
- All lists have loading state

## Effort

M (2 hours)

## Depends On

L4-25
