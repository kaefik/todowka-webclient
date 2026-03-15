# [L4-3] Add NotificationManager and Toast to Layout

## Status
[ ] Pending

## Goal
Integrate notification system into app layout.

## Input
- NotificationManager from L1-5
- Toast system from L1-2
- Existing `src/app/layout.tsx`

## Output
Updated `src/app/layout.tsx` with NotificationManager and ToastContainer.

## Done when
- Layout renders NotificationManager
- Layout renders ToastContainer
- ToastContainer receives toasts from useToast hook
- Components are placed correctly in DOM order
- Layout compiles without errors

## Implementation Details

### Add Imports

```typescript
import { NotificationManager } from '@/components/NotificationManager';
import { ToastContainer, useToast } from '@/components/ui/Toast';
```

### Update RootLayout Component

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { toasts } = useToast();

  return (
    <html lang="ru">
      <body>
        {/* ... existing providers ... */}
        <NotificationManager />
        <ToastContainer toasts={toasts} />
        {children}
      </body>
    </html>
  );
}
```

### Component Placement

1. Call `const { toasts } = useToast()` at the top of RootLayout
2. Add `<NotificationManager />` after existing providers
3. Add `<ToastContainer toasts={toasts} />` after NotificationManager
4. Ensure both are within `<body>` tags but before `{children}`

### DOM Order

The correct order is:

```
<body>
  <QueryClientProvider />
  {/* ... other providers ... */}
  <NotificationManager />
  <ToastContainer toasts={toasts} />
  {children}
</body>
```

This ensures:
- NotificationManager can initialize and request permissions
- Toasts are displayed above all content
- Toasts receive proper state from useToast

## Validation

Run these commands after implementation:

```bash
npm run typecheck
npm run lint
```

## Dependencies
- L1-2: Toast system
- L1-5: NotificationManager

## Estimated Time
1 hour
