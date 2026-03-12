# L4-19 — Create Input & Textarea components

## Goal

Implement form input components compatible with React Hook Form.

## Input

Task L0-02 completed.

## Output

`src/components/ui/Input.tsx` and `src/components/ui/Textarea.tsx`.

## Implementation

**Input.tsx:**
```typescript
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
```

**Textarea.tsx:**
```typescript
import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
```

## Done When

- Components work with React Hook Form
- Focus states visible with ring effect
- Proper styling matches design

## Effort

S (1 hour)

## Depends On

L0-02
