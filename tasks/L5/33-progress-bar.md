# L5-33 — Create ProgressBar component

## Goal

Implement visual progress bar.

## Input

Task L0-02 completed.

## Output

`src/components/project/ProgressBar.tsx` with ProgressBar component.

## Implementation

```typescript
interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

export function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
}
```

## Done When

- Bar shows percentage width
- Progress clamped between 0-100
- Smooth transition animation

## Effort

S (1 hour)

## Depends On

L0-02
