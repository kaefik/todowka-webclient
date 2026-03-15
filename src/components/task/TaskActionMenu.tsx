import { useEffect, useRef } from 'react';
import { Task } from '@/types';

interface TaskActionMenuProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onWaiting: () => void;
  onRemoveNext: () => void;
}

export const TaskActionMenu = ({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onWaiting,
  onRemoveNext,
}: TaskActionMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="sm:hidden absolute right-0 top-full mt-1 z-[60] bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] overflow-hidden"
    >
      <button
        onClick={() => {
          onEdit();
          onClose();
        }}
        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
      >
        <span className="text-lg">✏️</span>
        <span>Edit</span>
      </button>

      {task.status !== 'waiting' && (
        <button
          onClick={() => {
            onWaiting();
            onClose();
          }}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
        >
          <span className="text-lg">⏳</span>
          <span>Set Waiting</span>
        </button>
      )}

      {task.is_next_action && (
        <button
          onClick={() => {
            onRemoveNext();
            onClose();
          }}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
        >
          <span className="text-lg">❌</span>
          <span>Remove Next</span>
        </button>
      )}

      <div className="border-t border-gray-200" />

      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
      >
        <span className="text-lg">🗑️</span>
        <span>Delete</span>
      </button>
    </div>
  );
};
