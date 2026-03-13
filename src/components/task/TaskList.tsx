import type { Task } from '@/types';
import { TaskItem } from './TaskItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  onComplete?: (id: number) => void;
  onNextAction?: (id: number) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number) => void;
}

export function TaskList({ tasks, loading, onComplete, onNextAction, onEdit, onDelete }: TaskListProps) {
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="Create a new task to get started"
        icon="📝"
      />
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onComplete={onComplete}
          onNextAction={onNextAction}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
