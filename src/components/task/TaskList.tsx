import type { Task } from '@/types';
import { TaskItem } from './TaskItem';
import { EmptyState } from '@/components/ui/EmptyState';

interface TaskListProps {
  tasks: Task[];
  onComplete?: (id: number) => void;
  onNextAction?: (id: number) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number) => void;
}

export function TaskList({ tasks, onComplete, onNextAction, onEdit, onDelete }: TaskListProps) {
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
