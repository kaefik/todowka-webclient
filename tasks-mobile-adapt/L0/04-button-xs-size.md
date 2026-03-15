# MA-L0-04 — Add xs size to Button component

## Goal

Add a new `xs` size to the Button component with touch-friendly dimensions (min-height: 44px) for mobile devices.

## Input

- Existing `src/components/ui/Button.tsx`

## Output

- Updated `src/components/ui/Button.tsx` with xs size option

## Implementation Details

**Size Styles:**
Add to existing sizeStyles object:
```typescript
const sizeStyles = {
  xs: 'min-h-[44px] px-4 py-3 text-base',  // For mobile (touch targets)
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};
```

**Key Requirements:**
- xs size must have min-height: 44px (Apple HIG recommendation)
- Comfortable padding (px-4 py-3)
- Text size: text-base (16px minimum for readability)
- Maintain consistency with existing sizes
- Support all existing variants (primary, secondary, ghost, etc.)

**TypeScript:**
Update Size type to include 'xs':
```typescript
type Size = 'xs' | 'sm' | 'md' | 'lg';
```

## Steps

1. Read existing Button component
2. Add 'xs' to Size type
3. Add xs size to sizeStyles object
4. Verify all existing sizes still work
5. Test xs size visually

## Done When

- xs size option available
- xs buttons render with min-height: 44px
- All existing button sizes still work correctly
- TypeScript passes typecheck
- Visual testing confirms touch-friendly dimensions

## Effort

XS (30 minutes)

## Depends On

None
