# L4-25 — Create Spinner component

## Goal

Implement loading spinner.

## Input

Task L0-02 completed.

## Output

`src/components/ui/Spinner.tsx` with Spinner component.

## Implementation

```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-4',
  lg: 'w-12 h-12 border-4',
};

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-gray-300 border-t-primary ${sizeStyles[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
```

## Done When

- Spinner animates
- All sizes work

## Effort

XS (30 minutes)

## Depends On

L0-02
