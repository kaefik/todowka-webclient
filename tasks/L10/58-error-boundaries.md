# L10-58 — Add error boundaries

## Goal

Implement error boundary components for graceful error handling.

## Input

Task L8-44 completed.

## Output

Error boundary component wrapping page content.

## Implementation

Create `src/components/ErrorBoundary.tsx`:

```typescript
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-foreground-secondary mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

Update `src/app/layout.tsx`:

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary>
          <QueryClientProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <MainContent>{children}</MainContent>
            </div>
          </QueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

## Done When

- Error boundary wraps app
- Errors display gracefully
- App doesn't crash on errors

## Effort

M (2 hours)

## Depends On

L8-44
