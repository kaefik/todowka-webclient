# L4-23 — Create Modal component

## Goal

Implement modal dialog component with open/close state and backdrop.

## Input

Task L4-17, L4-18 completed.

## Output

`src/components/ui/Modal.tsx` with Modal component.

## Implementation

```typescript
'use client';

import { useEffect, type ReactNode } from 'react';
import { Button } from './Button';
import { Card } from './Card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg mx-4">
        <Card>
          {title && (
            <CardHeader>
              <h2 className="text-xl font-semibold">{title}</h2>
            </CardHeader>
          )}
          <CardContent>{children}</CardContent>
          {footer && (
            <CardFooter className="flex justify-end gap-2">
              {footer}
            </CardFooter>
          )}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </Card>
      </div>
    </div>
  );
}
```

## Done When

- Modal opens/closes on command
- Backdrop click closes modal
- ESC key closes modal (optional enhancement)
- Content displays correctly

## Effort

M (2 hours)

## Depends On

L4-17, L4-18
