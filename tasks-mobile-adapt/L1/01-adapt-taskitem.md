# MA-L1-01 — Adapt TaskItem for mobile

## Goal

Adapt TaskItem component to use simplified button layout on mobile with TaskActionMenu.

## Input

- Existing `src/components/task/TaskItem.tsx`
- New `src/components/task/TaskActionMenu.tsx` from MA-L0-01
- Button with xs size from MA-L0-04

## Output

- Updated `src/components/task/TaskItem.tsx` with responsive button layout

## Implementation Details

**Desktop Layout (>=640px):**
- Keep existing buttons: Edit, Waiting, Next, Complete, Delete

**Mobile Layout (<640px):**
- Simplified to 3 buttons:
  - Complete (✓) — size="xs"
  - Next (⚡) — size="xs", conditional (showNextButton)
  - Action Menu (•••) — size="xs", opens TaskActionMenu

**Conditional Rendering:**
```tsx
// Mobile view (<640px):
<div className="flex gap-2 sm:hidden">
  <Button onClick={() => onComplete?.(task.id)} size="xs">✓</Button>
  {showNextButton && (
    <Button onClick={() => onNextAction?.(task.id)} size="xs">⚡</Button>
  )}
  <Button onClick={() => setActionMenuOpen(true)} size="xs">•••</Button>
</div>

// Desktop view (>=640px):
<div className="hidden sm:flex gap-2">
  {/* Existing buttons */}
</div>
```

**TaskActionMenu Integration:**
- Add state: `const [actionMenuOpen, setActionMenuOpen] = useState(false);`
- Pass all action callbacks to TaskActionMenu
- Close menu after action execution

**Touch Targets:**
- All mobile buttons use size="xs" (44px min-height)
- Ensure adequate spacing (gap-2)

## Steps

1. Read existing TaskItem component
2. Add state for action menu
3. Add TaskActionMenu import
4. Implement conditional rendering for mobile/desktop
5. Replace mobile buttons with simplified layout
6. Add TaskActionMenu component
7. Wire up all action callbacks
8. Test on mobile viewport

## Done When

- Mobile layout shows only 3 buttons (Complete, Next, •••)
- Desktop layout shows all existing buttons
- TaskActionMenu opens and closes correctly
- All actions work from both layouts
- Touch targets meet 44px minimum
- No visual regression on desktop
- TypeScript passes typecheck

## Effort

M (2 hours)

## Depends On

MA-L0-01 (TaskActionMenu), MA-L0-04 (Button xs size)
