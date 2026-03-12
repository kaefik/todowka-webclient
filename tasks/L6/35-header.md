# L6-35 — Create Header component

## Goal

Implement top header with page title and mobile menu toggle.

## Input

Task L4-17 completed.

## Output

`src/components/layout/Header.tsx` with Header component.

## Implementation

```typescript
'use client';

import { useNavigationStore } from '@/stores/useNavigationStore';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { toggleSidebar } = useNavigationStore();

  return (
    <header className="bg-white border-b border-border px-4 py-3 flex items-center gap-4 lg:hidden">
      <Button variant="ghost" size="sm" onClick={toggleSidebar}>
        ☰
      </Button>
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  );
}
```

## Done When

- Displays title
- Menu toggle button works
- Hidden on desktop (sidebar always visible)

## Effort

S (1 hour)

## Depends On

L4-17
