# MA-L0-01 — Create TaskActionMenu component

## Goal

Create a menu component for task actions (Edit, Delete, Set Waiting, Remove Next Action) for mobile devices.

## Input

- Existing Task type from `@/types`
- Existing button styles from `@/components/ui/Button`

## Output

- `src/components/task/TaskActionMenu.tsx` — menu component with dropdown functionality

## Implementation Details

**Props Interface:**
```typescript
interface TaskActionMenuProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onWaiting: () => void;
  onRemoveNext: () => void;
}
```

**Menu Items:**
- Edit (✏️) — always shown
- Set Waiting (⏳) — shown only when task.status !== 'waiting'
- Remove Next (❌) — shown only when task.is_next_action === true
- Delete (🗑️) — always shown

**Key Features:**
- Use useState for isOpen state management
- Close menu on click outside (useEffect with document click listener)
- Absolute positioning relative to trigger button
- Z-index: 60 (higher than modal: 50)
- Smooth transition animation
- Visible only on mobile (<640px)

**Styling:**
- Dropdown menu with white background
- Shadow and border for visibility
- Menu items with hover states
- Icon + label for each action

## Steps

1. Create `src/components/task/TaskActionMenu.tsx`
2. Define TaskActionMenuProps interface
3. Implement menu items with conditional rendering
4. Add click-outside handler
5. Add smooth transitions/animations
6. Add Tailwind styles for mobile visibility

## Done When

- Component renders without errors
- Menu opens and closes correctly
- All menu items execute their callbacks
- Click outside closes menu
- Component visible only on mobile screens (<640px)
- TypeScript passes typecheck

## Effort

M (2 hours)

## Depends On

None
