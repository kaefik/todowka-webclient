# L6-34 — Create Sidebar component

## Goal

Implement navigation sidebar with all GTD pages.

## Input

Task L4-17 completed.

## Output

`src/components/layout/Sidebar.tsx` with Sidebar component.

## Implementation

```typescript
'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useNavigationStore } from '@/stores/useNavigationStore';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/inbox', label: 'Inbox', icon: '📥' },
  { path: '/tasks', label: 'Tasks', icon: '✓' },
  { path: '/tasks/next-actions', label: 'Next Actions', icon: '⚡' },
  { path: '/projects', label: 'Projects', icon: '📁' },
  { path: '/areas', label: 'Areas', icon: '🎯' },
  { path: '/contexts', label: 'Contexts', icon: '📍' },
  { path: '/tags', label: 'Tags', icon: '🏷️' },
  { path: '/review', label: 'Review', icon: '📋' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useNavigationStore();

  return (
    <>
      {/* Mobile backdrop */}
      {!sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-border z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:w-64`}
      >
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold">TodoGTD</h1>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? 'primary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => window.location.href = item.path}
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
```

## Done When

- Navigation works, routes to correct pages
- Active page highlighted
- Collapsible on mobile
- All nav items present

## Effort

M (2 hours)

## Depends On

L4-17
