# MA-L0-03 — Create BottomNavigation component

## Goal

Create bottom navigation bar for mobile devices with 6 main items and badges for Inbox/Next Actions.

## Input

- useInbox() and useNextActions() hooks from `@/lib/hooks`
- usePathname() and useRouter() from `next/navigation`

## Output

- `src/components/layout/BottomNavigation.tsx` — bottom navigation bar

## Implementation Details

**Navigation Items:**
```typescript
interface BottomNavigationItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;
}
```

**Items:**
```typescript
const navItems: BottomNavigationItem[] = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/inbox', label: 'Inbox', icon: '📥', badge: inboxCount },
  { path: '/tasks/next-actions', label: 'Next Actions', icon: '⚡', badge: nextActionsCount },
  { path: '/tasks', label: 'Tasks', icon: '✓' },
  { path: '/projects', label: 'Projects', icon: '📁' },
  { path: '/more', label: 'More', icon: '⋯' },
];
```

**Key Features:**
- Visible only on mobile (<640px) — `flex sm:hidden`
- Fixed position at bottom of screen
- 6 items with equal width
- Active state highlighting (primary color)
- Badges for Inbox and Next Actions (only if count > 0)
- Click on More opens MoreMenu dropdown
- Touch-friendly (min-height: 44px for items)

**Styling:**
- Fixed bottom-0, left-0, right-0
- White background, border-top
- z-index: 50 (below modals and menus)
- Flex row with equal spacing
- Active item: primary color background
- Badge: red circle with count

**Integration:**
- Use useInbox() to get inboxCount
- Use useNextActions() to get nextActionsCount
- Use usePathname() to determine active item
- Use router.push() for navigation

## Steps

1. Create `src/components/layout/BottomNavigation.tsx`
2. Define BottomNavigationItem interface
3. Implement navItems array
4. Add data fetching hooks (useInbox, useNextActions)
5. Add active state logic with usePathname
6. Add navigation with router
7. Add badge display logic (only > 0)
8. Add MoreMenu integration
9. Style for mobile visibility and touch targets

## Done When

- Component renders without errors
- Bottom nav visible only on mobile (<640px)
- All 6 items displayed correctly
- Active state highlights correctly
- Badges show correct counts
- Clicking items navigates correctly
- More opens MoreMenu dropdown
- Touch targets meet 44px minimum
- TypeScript passes typecheck

## Effort

L (3 hours)

## Depends On

MA-L0-02 (MoreMenu)
