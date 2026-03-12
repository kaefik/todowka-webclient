# L4-24 — Create EmptyState component

## Goal

Implement empty state placeholder component.

## Input

Task L0-02 completed.

## Output

`src/components/ui/EmptyState.tsx` with EmptyState component.

## Implementation

```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {icon && <div className="text-6xl mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && <p className="text-foreground-secondary mb-4">{description}</p>}
      {action}
    </div>
  );
}
```

## Done When

- Displays when no data exists
- Icon, title, description, action all render correctly
- Centered and visually appealing

## Effort

S (1 hour)

## Depends On

L0-02
