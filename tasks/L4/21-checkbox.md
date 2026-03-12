# L4-21 — Create Checkbox component

## Goal

Implement checkbox component.

## Input

Task L0-02 completed.

## Output

`src/components/ui/Checkbox.tsx` with Checkbox component.

## Implementation

```typescript
'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onChange, label, className = '', ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className={`w-5 h-5 rounded border border-gray-300 text-primary focus:ring-2 focus:ring-primary ${className}`}
          {...props}
        />
        {label && <span className="text-sm">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
```

## Done When

- Component toggles state
- Label works correctly
- Focus state visible

## Effort

S (1 hour)

## Depends On

L0-02
