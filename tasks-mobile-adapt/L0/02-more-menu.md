# MA-L0-02 — Create MoreMenu component

## Goal

Create a dropdown menu for additional navigation items (Completed, Areas, Contexts, Tags, Trash, Review) for the "More" bottom nav item.

## Input

- Next.js router from `next/navigation`
- Existing button styles

## Output

- `src/components/layout/MoreMenu.tsx` — dropdown menu component

## Implementation Details

**Props Interface:**
```typescript
interface MoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Menu Items:**
```typescript
const moreItems = [
  { path: '/completed', label: 'Completed', icon: '✅' },
  { path: '/areas', label: 'Areas', icon: '🎯' },
  { path: '/contexts', label: 'Contexts', icon: '📍' },
  { path: '/tags', label: 'Tags', icon: '🏷️' },
  { path: '/trash', label: 'Trash', icon: '🗑️' },
  { path: '/review', label: 'Review', icon: '📋' },
];
```

**Key Features:**
- Dropdown menu triggered by "More" button
- Close on menu item click (navigation)
- Close on click outside menu
- Use router.push() for navigation
- Smooth transitions
- Z-index: 60

**Styling:**
- White background with shadow
- Position: absolute, bottom: 100% (above the button)
- Right-aligned with the More button
- Full width or appropriate max-width
- Menu items with hover states

## Steps

1. Create `src/components/layout/MoreMenu.tsx`
2. Define MoreMenuProps interface
3. Implement menu items array
4. Add navigation logic with router
5. Add click-outside handler
6. Add smooth transitions
7. Style for mobile visibility

## Done When

- Component renders without errors
- Menu opens and closes correctly
- Clicking menu items navigates to correct routes
- Click outside closes menu
- Menu positioned correctly above More button
- TypeScript passes typecheck

## Effort

M (2 hours)

## Depends On

None
