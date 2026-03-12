# L6-36 — Create MainContent component

## Goal

Implement main content wrapper with proper spacing.

## Input

Task L6-34, L6-35 completed.

## Output

`src/components/layout/MainContent.tsx` with MainContent component.

## Implementation

```typescript
import type { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="flex-1 p-4 lg:p-8 overflow-auto bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">{children}</div>
    </main>
  );
}
```

## Done When

- Wraps page content
- Proper padding and spacing
- Responsive padding

## Effort

XS (30 minutes)

## Depends On

L6-34, L6-35
