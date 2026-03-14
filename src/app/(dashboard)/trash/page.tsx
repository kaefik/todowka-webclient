'use client';

import { useState, useEffect } from 'react';
import { useDeletedTasks, useRestoreTask, usePermanentDeleteTask, useDeleteAllFromTrash } from '@/lib/hooks/useTasks';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import type { Task } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function TrashPage() {
  const { data: deletedTasks, isLoading, refetch } = useDeletedTasks();
  const restoreTask = useRestoreTask();
  const permanentDeleteTask = usePermanentDeleteTask();
  const deleteAllFromTrash = useDeleteAllFromTrash();
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  console.log('[TrashPage] deletedTasks:', deletedTasks);
  console.log('[TrashPage] isLoading:', isLoading);
  console.log('[TrashPage] restoreTask status:', {
    isPending: restoreTask.isPending,
    isSuccess: restoreTask.isSuccess,
    isError: restoreTask.isError,
    error: restoreTask.error
  });

  useEffect(() => {
    if (!restoreTask.isPending && restoringId !== null) {
      console.log('[TrashPage] Restore mutation completed, resetting restoringId');
      setRestoringId(null);
      refetch();
    }
  }, [restoreTask.isPending, restoringId, refetch]);

  useEffect(() => {
    if (!permanentDeleteTask.isPending && deletingId !== null) {
      console.log('[TrashPage] Permanent delete mutation completed, resetting deletingId');
      setDeletingId(null);
      refetch();
    }
  }, [permanentDeleteTask.isPending, deletingId, refetch]);

  const handleRestore = (id: number) => {
    console.log('[TrashPage] handleRestore called with id:', id);
    if (confirm('Restore this task?')) {
      console.log('[TrashPage] Starting restore mutation for id:', id);
      setRestoringId(id);
      restoreTask.mutate(id);
    }
  };

  const handlePermanentDelete = (id: number) => {
    console.log('[TrashPage] handlePermanentDelete called with id:', id);
    if (confirm('Permanently delete this task? This action cannot be undone.')) {
      console.log('[TrashPage] Starting permanent delete for id:', id);
      setDeletingId(id);
      permanentDeleteTask.mutate(id);
    }
  };

  const handleDeleteAll = () => {
    console.log('[TrashPage] handleDeleteAll called');
    if (confirm('Permanently delete all tasks from trash? This action cannot be undone.')) {
      console.log('[TrashPage] Starting delete all');
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
        {deletedTasks?.map((task: Task) => (
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
                  disabled={restoringId === task.id}
                >
                  {restoringId === task.id ? 'Restoring...' : 'Restore'}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handlePermanentDelete(task.id)}
                  disabled={deletingId === task.id}
                >
                  {deletingId === task.id ? 'Deleting...' : 'Delete Forever'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
