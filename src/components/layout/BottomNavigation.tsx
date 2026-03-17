'use client';

import { useInbox } from '@/lib/hooks/useInbox';
import { useNextActions } from '@/lib/hooks/useTasks';
import { useUnreadNotifications } from '@/lib/hooks/useNotifications';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { MoreMenu } from './MoreMenu';
import { ConnectionStatus } from './ConnectionStatus';
import type { PaginatedResponse, Task } from '@/types';

interface BottomNavigationItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;
}

function getTaskCount(data: Task[] | PaginatedResponse<Task> | undefined): number {
  if (!data) return 0;
  if (Array.isArray(data)) return data.length;
  if ('items' in data) return data.items?.length || 0;
  return 0;
}

export const BottomNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const inboxQuery = useInbox();
  const nextActionsQuery = useNextActions();
  const { data: unreadNotifications } = useUnreadNotifications();

  const inboxCount = getTaskCount(inboxQuery.data);
  const nextActionsCount = getTaskCount(nextActionsQuery.data);
  const unreadCount = unreadNotifications?.length || 0;

  const navItems: BottomNavigationItem[] = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/inbox', label: 'Inbox', icon: '📥', badge: inboxCount },
    { path: '/tasks/next-actions', label: 'Next Actions', icon: '⚡', badge: nextActionsCount },
    { path: '/tasks', label: 'Tasks', icon: '✓' },
    { path: '/projects', label: 'Projects', icon: '📁' },
    { path: '/notifications', label: 'Notifications', icon: '🔔', badge: unreadCount },
    { path: '/more', label: 'More', icon: '⋯' },
  ];

  const handleNavClick = (path: string) => {
    if (path === '/more') {
      setIsMoreMenuOpen(!isMoreMenuOpen);
    } else {
      setIsMoreMenuOpen(false);
      router.push(path);
    }
  };

  const isActive = (path: string) => {
    if (path === '/more') return false;
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-stretch h-16">
          {navItems.map((item) => (
            <div key={item.path} className="relative flex-1">
              <button
                onClick={() => handleNavClick(item.path)}
                className={`w-full h-full flex flex-col items-center justify-center gap-1 transition-colors min-h-[44px] ${
                  isActive(item.path) ? 'bg-primary text-white' : 'text-gray-600'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </button>
              {item.path === '/more' && (
                <div className="relative">
                  <MoreMenu isOpen={isMoreMenuOpen} onClose={() => setIsMoreMenuOpen(false)} />
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
      <div className="fixed bottom-16 left-0 right-0 p-2">
        <ConnectionStatus />
      </div>
    </>
  );
};
