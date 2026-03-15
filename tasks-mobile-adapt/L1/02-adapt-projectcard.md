# MA-L1-02 — Adapt ProjectCard for mobile

## Goal

Adapt ProjectCard component to use simplified button layout on mobile with action menu.

## Input

- Existing `src/components/project/ProjectCard.tsx`
- TaskActionMenu pattern from MA-L1-01
- Button with xs size from MA-L0-04

## Output

- Updated `src/components/project/ProjectCard.tsx` with responsive button layout

## Implementation Details

**Desktop Layout (>=640px):**
- Keep existing buttons: Edit, Complete, Delete

**Mobile Layout (<640px):**
- Simplified to 2 buttons:
  - Complete (✓) — size="xs"
  - Action Menu (•••) — size="xs", opens action menu

**Conditional Rendering:**
```tsx
// Mobile view (<640px):
<div className="flex gap-2 sm:hidden">
  <Button onClick={() => onComplete?.(project.id)} size="xs">✓</Button>
  <Button onClick={() => setActionMenuOpen(true)} size="xs">•••</Button>
</div>

// Desktop view (>=640px):
<div className="hidden sm:flex gap-2">
  {/* Existing buttons */}
</div>
```

**Action Menu Items:**
- Edit (✏️) — always shown
- Delete (🗑️) — always shown

**Implementation Options:**
1. Reuse TaskActionMenu (if suitable for projects)
2. Create separate ProjectActionMenu component
3. Inline menu using dropdown pattern

Choose option 2 (create ProjectActionMenu) for clarity and separation of concerns.

**Touch Targets:**
- All mobile buttons use size="xs" (44px min-height)
- Ensure adequate spacing (gap-2)

## Steps

1. Read existing ProjectCard component
2. Create `src/components/project/ProjectActionMenu.tsx`
3. Add state for action menu in ProjectCard
4. Implement conditional rendering for mobile/desktop
5. Replace mobile buttons with simplified layout
6. Add ProjectActionMenu component
7. Wire up all action callbacks
8. Test on mobile viewport

## Done When

- Mobile layout shows only 2 buttons (Complete, •••)
- Desktop layout shows all existing buttons
- ProjectActionMenu opens and closes correctly
- All actions work from both layouts
- Touch targets meet 44px minimum
- No visual regression on desktop
- TypeScript passes typecheck

## Effort

M (2 hours)

## Depends On

MA-L0-04 (Button xs size)
