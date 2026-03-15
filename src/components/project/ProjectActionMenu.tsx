import { useEffect, useRef } from 'react';
import { Project } from '@/types';

interface ProjectActionMenuProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectActionMenu = ({
  project,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ProjectActionMenuProps) => {
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
