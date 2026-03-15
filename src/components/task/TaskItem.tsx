'use client';

import { useState } from 'react';
import type { Task } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TaskActionMenu } from './TaskActionMenu';

interface TaskItemProps {
  task: Task;
  onComplete?: (id: number) => void;
  onNextAction?: (id: number) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number) => void;
  onWaiting?: (task: Task) => void;
  showNextButton?: boolean;
  showWaitingButton?: boolean;
}

export function TaskItem({ task, onComplete, onNextAction, onEdit, onDelete, onWaiting, showNextButton = true, showWaitingButton = false }: TaskItemProps) {
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  return (
    <div className="p-3 sm:p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`font-medium text-base sm:text-lg truncate ${task.completed ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </h3>
            {!task.completed && <Badge variant="status" value={task.status} />}
            <Badge variant="priority" value={task.priority} />
          </div>
          {task.description && (
            <p className="text-sm text-slate-600 mb-2 line-clamp-2 sm:line-clamp-3">{task.description}</p>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            {task.reminder_enabled && task.reminder_time && (
              <span>🔔 {new Date(task.reminder_time).toLocaleString()}</span>
            )}
            {task.recurrence_type && task.recurrence_type !== 'none' && (
              <span>🔄 {task.recurrence_type}</span>
            )}
            {task.due_date && (
              <span>📅 {new Date(task.due_date).toLocaleDateString()}</span>
            )}
          </div>
          {task.completed && task.completed_at && (
            <p className="text-xs text-slate-500 mb-2">
              Completed: {new Date(task.completed_at).toLocaleDateString()}
            </p>
          )}
          {task.waiting_for && !task.completed && (
            <p className="text-xs text-orange-600 mb-2">
              ⏳ Waiting for: {task.waiting_for}
            </p>
          )}
          {task.is_next_action && !task.completed && (
            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              Next Action
            </span>
          )}
        </div>
        <div className="relative">
          <div className="flex gap-2 sm:hidden">
            <Button type="button" variant="primary" size="xs" onClick={() => onComplete?.(task.id)}>
              ✓
            </Button>
            {showNextButton && !task.completed && task.status !== 'waiting' && (
              <Button
                type="button"
                variant={task.is_next_action ? "primary" : "ghost"}
                size="xs"
                onClick={() => onNextAction?.(task.id)}
              >
                ⚡
              </Button>
            )}
            <Button type="button" variant="ghost" size="xs" onClick={() => setActionMenuOpen(true)}>
              •••
            </Button>
            <TaskActionMenu
              task={task}
              isOpen={actionMenuOpen}
              onClose={() => setActionMenuOpen(false)}
              onEdit={() => onEdit?.(task)}
              onDelete={() => onDelete?.(task.id)}
              onWaiting={() => onWaiting?.(task)}
              onRemoveNext={() => onNextAction?.(task.id)}
            />
          </div>
          <div className="hidden sm:flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => onEdit?.(task)}>
              Edit
            </Button>
            {showWaitingButton && !task.completed && task.status !== 'waiting' && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onWaiting?.(task)}
              >
                ⏳
              </Button>
            )}
            {showNextButton && !task.completed && task.status !== 'waiting' && (
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
    </div>
  );
}
