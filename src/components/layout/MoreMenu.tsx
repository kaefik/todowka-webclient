import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface MoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  path: string;
  label: string;
  icon: string;
}

export const MoreMenu = ({ isOpen, onClose }: MoreMenuProps) => {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const moreItems: MenuItem[] = [
    { path: '/completed', label: 'Completed', icon: '✅' },
    { path: '/areas', label: 'Areas', icon: '🎯' },
    { path: '/contexts', label: 'Contexts', icon: '📍' },
    { path: '/tags', label: 'Tags', icon: '🏷️' },
    { path: '/trash', label: 'Trash', icon: '🗑️' },
    { path: '/review', label: 'Review', icon: '📋' },
  ];

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
      className="sm:hidden absolute right-0 bottom-full mb-1 z-[60] bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] overflow-hidden"
    >
      {moreItems.map((item) => (
        <button
          key={item.path}
          onClick={() => {
            router.push(item.path);
            onClose();
          }}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};
