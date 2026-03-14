'use client';

import { useDeletedTasks, useRestoreTask, usePermanentDeleteTask, useDeleteAllFromTrash } from '@/lib/hooks/useTasks';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import type { Task } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function TrashPage() {
  const { data: deletedTasks, isLoading } = useDeletedTasks();
  const restoreTask = useRestoreTask();
  const permanentDeleteTask = usePermanentDeleteTask();
  const deleteAllFromTrash = useDeleteAllFromTrash();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!deletedTasks || deletedTasks.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Trash</h1>
        <EmptyState
          title="Trash is empty"
          description="Deleted tasks will appear here"
          icon="🗑️"
        />
      </div>
    );
  }

  const handleRestore = (id: number) => {
    if (confirm('Restore this task?')) {
      restoreTask.mutate(id);
    }
  };

  const handlePermanentDelete = (id: number) => {
    if (confirm('Permanently delete this task? This action cannot be undone.')) {
      permanentDeleteTask.mutate(id);
    }
  };

  const handleDeleteAll = () => {
    if (confirm('Permanently delete all tasks from trash? This action cannot be undone.')) {
      deleteAllFromTrash.mutate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trash</h1>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleDeleteAll}
          disabled={deleteAllFromTrash.isPending}
        >
          {deleteAllFromTrash.isPending ? 'Deleting...' : 'Delete All Tasks'}
        </Button>
      </div>

      <div className="space-y-3">
        {deletedTasks.map((task: Task) => (
          <div key={task.id} className="p-4 border border-border rounded-lg bg-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </h3>
                </div>
                {task.description && (
                  <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                )}
                {task.deleted_at && (
                  <p className="text-xs text-slate-500">
                    Deleted {formatDistanceToNow(new Date(task.deleted_at), { addSuffix: true, locale: ru })}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRestore(task.id)}
                  disabled={restoreTask.isPending}
                >
                  Restore
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handlePermanentDelete(task.id)}
                  disabled={permanentDeleteTask.isPending}
                >
                  Delete Forever
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
