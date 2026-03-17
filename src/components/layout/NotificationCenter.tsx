'use client';

import { useState, useRef, useEffect } from 'react';
import { useUnreadNotifications } from '@/lib/hooks/useNotifications';
import { NotificationList } from '@/components/notifications/NotificationList';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: unreadNotifications, isLoading } = useUnreadNotifications();

  const unreadCount = unreadNotifications?.length || 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Уведомления"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <NotificationList limit={5} />
          </div>
          <div className="p-3 border-t bg-gray-50">
            <a
              href="/notifications"
              className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              Все уведомления →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
