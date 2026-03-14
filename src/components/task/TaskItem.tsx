'use client';

import type { Task } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface TaskItemProps {
  task: Task;
  onComplete?: (id: number) => void;
  onNextAction?: (id: number) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number) => void;
  showNextButton?: boolean;
}

export function TaskItem({ task, onComplete, onNextAction, onEdit, onDelete, showNextButton = true }: TaskItemProps) {
  return (
    <div className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </h3>
            {!task.completed && <Badge variant="status" value={task.status} />}
            <Badge variant="priority" value={task.priority} />
          </div>
          {task.description && (
            <p className="text-sm text-slate-600 mb-2">{task.description}</p>
          )}
          {task.completed && task.completed_at && (
            <p className="text-xs text-slate-500 mb-2">
              Completed: {new Date(task.completed_at).toLocaleDateString()}
            </p>
          )}
          {task.is_next_action && !task.completed && (
            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              Next Action
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => onEdit?.(task)}>
            Edit
          </Button>
          {showNextButton && !task.completed && (
            <Button 
              type="button" 
              variant={task.is_next_action ? "primary" : "ghost"} 
              size="sm" 
              onClick={() => onNextAction?.(task.id)}
            >
              {task.is_next_action ? 'Next ✓' : 'Next'}
            </Button>
          )}
          <Button type="button" variant="primary" size="sm" onClick={() => onComplete?.(task.id)}>
            ✓
          </Button>
          <Button type="button" variant="destructive" size="sm" onClick={() => onDelete?.(task.id)}>
            ✕
          </Button>
        </div>
      </div>
    </div>
  );
}
