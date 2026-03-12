# L3-16 — Setup React Query client provider

## Goal

Configure TanStack Query with provider and default options.

## Input

Task L0-01 completed.

## Output

`src/lib/QueryClientProvider.tsx` with QueryClient setup.

## Implementation

```typescript
'use client';

import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

export function QueryClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </TanStackQueryClientProvider>
  );
}
```

Also add to `src/app/layout.tsx`:
```typescript
import { QueryClientProvider } from '@/lib/QueryClientProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

## Done When

- QueryClientProvider wraps app in layout
- Default queries configured with retry logic
- ReactQueryDevtools available in dev

## Effort

M (2 hours)

## Depends On

L0-01
