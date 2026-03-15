'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useNavigationStore } from '@/stores/useNavigationStore';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/inbox', label: 'Inbox', icon: '📥' },
  { path: '/tasks', label: 'Tasks', icon: '✓' },
  { path: '/tasks/next-actions', label: 'Next Actions', icon: '⚡' },
  { path: '/completed', label: 'Completed', icon: '✅' },
  { path: '/projects', label: 'Projects', icon: '📁' },
  { path: '/areas', label: 'Areas', icon: '🎯' },
  { path: '/contexts', label: 'Contexts', icon: '📍' },
  { path: '/tags', label: 'Tags', icon: '🏷️' },
  { path: '/trash', label: 'Trash', icon: '🗑️' },
  { path: '/review', label: 'Review', icon: '📋' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useNavigationStore();

  return (
    <>
      {sidebarOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`hidden sm:block fixed top-0 left-0 h-full bg-white border-r border-border z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:w-64`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h1 className="text-xl font-bold">ToDowka</h1>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Button
                key={item.path}
                type="button"
                variant={isActive ? 'primary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  router.push(item.path);
                  setSidebarOpen(false);
                }}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
