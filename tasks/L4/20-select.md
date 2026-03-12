# L4-20 — Create Select component

## Goal

Implement dropdown select component.

## Input

Task L0-02 completed.

## Output

`src/components/ui/Select.tsx` with Select, SelectTrigger, SelectContent, SelectItem.

## Implementation

```typescript
'use client';

import { useState, useRef, useEffect, type ReactNode, type ReactHTMLAttributes } from 'react';

interface SelectProps {
  value?: string | number;
  onChange?: (value: string) => void;
  children: ReactNode;
  placeholder?: string;
  className?: string;
}

export function Select({ value, onChange, children, placeholder = 'Select...', className = '' }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedChild = Array.isArray(children)
    ? children.find((child: any) => child?.props?.value === value)
    : null;
  const displayValue = selectedChild?.props?.children || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-border rounded-md bg-white text-left flex justify-between items-center"
      >
        <span className={value ? '' : 'text-gray-400'}>{displayValue}</span>
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {children}
        </div>
      )}
    </div>
  );
}

interface SelectItemProps extends ReactHTMLAttributes<HTMLDivElement> {
  value: string;
}

export function SelectItem({ value, children, className = '', ...props }: SelectItemProps) {
  return (
    <div
      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${className}`}
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        const parent = (e.target as HTMLElement).closest('[data-select-parent]') as any;
        if (parent?.props?.onChange) {
          parent.props.onChange(value);
        }
      }}
      data-value={value}
    >
      {children}
    </div>
  );
}
```

Update Select to pass onChange to children:
```typescript
<Select onChange={onChange} data-select-parent>
```

## Done When

- Component renders options, handles selection
- Dropdown opens/closes correctly
- Click outside closes dropdown

## Effort

S (1 hour)

## Depends On

L0-02
