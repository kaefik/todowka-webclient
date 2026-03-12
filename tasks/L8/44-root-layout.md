# L8-44 — Create root layout (app/layout.tsx)

## Goal

Implement app layout with Sidebar, Header, MainContent and QueryClientProvider.

## Input

Task L6-34, L6-35, L6-36, L3-16 completed.

## Output

`src/app/layout.tsx` with root layout.

## Implementation

```typescript
import type { Metadata } from 'next';
import './globals.css';
import { QueryClientProvider } from '@/lib/QueryClientProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { MainContent } from '@/components/layout/MainContent';

export const metadata: Metadata = {
  title: 'TodoGTD - GTD Task Management',
  description: 'Personal GTD task management app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryClientProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <MainContent>{children}</MainContent>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

## Done When

- Layout displays on all pages
- Sidebar works
- QueryClientProvider wraps app

## Effort

S (1 hour)

## Depends On

L6-34, L6-35, L6-36, L3-16
