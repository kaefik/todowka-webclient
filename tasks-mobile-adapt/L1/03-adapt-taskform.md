# MA-L1-03 — Adapt TaskForm for mobile

## Goal

Make TaskForm fields stack vertically on mobile devices (1 column) instead of side-by-side (2 columns).

## Input

- Existing `src/components/task/TaskForm.tsx`

## Output

- Updated `src/components/task/TaskForm.tsx` with responsive grid layout

## Implementation Details

**Current Layout:**
```tsx
<div className="grid grid-cols-2 gap-4">
```

**New Layout:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
```

**Breakpoints:**
- Mobile (<640px): `grid-cols-1` — fields stack vertically
- Tablet/Desktop (>=640px): `sm:grid-cols-2` — fields side-by-side

**Affected Fields:**
- Priority + Project (currently in 2 columns)
- Any other fields currently in 2-column grid

**Benefits:**
- Better readability on small screens
- Adequate touch targets for all inputs
- No horizontal scrolling
- Maintains desktop layout efficiency

## Steps

1. Read existing TaskForm component
2. Find all grid-cols-2 usage
3. Replace with grid-cols-1 sm:grid-cols-2
4. Test on mobile viewport
5. Verify desktop layout unchanged

## Done When

- Fields stack vertically on mobile (<640px)
- Fields remain side-by-side on desktop (>=640px)
- No horizontal scrolling on mobile
- All form functionality preserved
- No visual regression on desktop
- TypeScript passes typecheck

## Effort

XS (30 minutes)

## Depends On

None
