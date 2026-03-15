# [L1-2] Create Toast System

## Status
[ ] Pending

## Goal
Build in-app notification toast system.

## Input
- None

## Output
`src/components/ui/Toast.tsx` with useToast hook and ToastContainer component.

## Done when
- useToast hook manages toasts state
- `show()` method adds toasts
- Toasts auto-dismiss after 5 seconds
- ToastContainer renders toasts
- Each toast type has proper styling
- Components are properly typed

## Implementation Details

### File Structure

```tsx
'use client';

import { useEffect, useState } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

let toastId = 0;

export function useToast() {
  // Implementation
}

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  // Implementation
}
```

### useToast Hook

#### State Management

```tsx
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = (message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${toastId++}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  return { toasts, show };
}
```

#### Show Method

1. Generate unique ID using `toastId++`
2. Add toast to state
3. Set timeout to remove after 5000ms

### ToastContainer Component

```tsx
export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div key={toast.id} className={`p-4 rounded-lg shadow-lg ${
          toast.type === 'error' ? 'bg-red-500 text-white' :
          toast.type === 'success' ? 'bg-green-500 text-white' :
          toast.type === 'warning' ? 'bg-yellow-500 text-white' :
          'bg-slate-700 text-white'
        }`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
```

### Styling by Type

- `info`: `bg-slate-700 text-white`
- `success`: `bg-green-500 text-white`
- `warning`: `bg-yellow-500 text-white`
- `error`: `bg-red-500 text-white`

## Validation

Run these commands after implementation:

```bash
npm run typecheck
npm run lint
```

## Dependencies
None

## Estimated Time
2 hours
