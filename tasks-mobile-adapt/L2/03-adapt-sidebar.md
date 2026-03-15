# MA-L2-03 — Verify Sidebar adaptation for mobile

## Goal

Ensure Sidebar behaves correctly with BottomNavigation: hidden on mobile, overlay on tablet, static on desktop.

## Input

- Existing `src/components/layout/Sidebar.tsx`

## Output

- Verified/updated Sidebar with correct visibility at all breakpoints

## Implementation Details

**Expected Behavior:**

**Mobile (<640px):**
- Sidebar hidden completely
- BottomNavigation provides navigation
- Optional: Show hamburger menu to open overlay sidebar

**Tablet (640px-1024px):**
- Sidebar as overlay (toggleable)
- Header provides toggle button
- BottomNavigation hidden on tablet

**Desktop (>=1024px):**
- Sidebar static (always visible)
- Full-width main content area

**Current State Analysis:**
- Check existing responsive classes
- Verify lg:hidden for mobile behavior
- Verify desktop visibility at lg breakpoint

**Potential Issues:**
- Sidebar showing on mobile with BottomNavigation
- Sidebar not showing on desktop
- Toggle button missing on tablet

**Implementation:**
```tsx
// Expected responsive pattern:
<Sidebar className="hidden lg:flex" />  // Desktop static
// Plus overlay variant for tablet
```

**State Management:**
- Use useNavigationStore for sidebarOpen state
- Handle mobile overlay opening (if hamburger added)
- Handle tablet overlay toggle

## Steps

1. Read existing Sidebar component
2. Analyze current responsive behavior
3. Update visibility classes if needed
4. Ensure correct behavior at all breakpoints
5. Test on mobile viewport
6. Test on tablet viewport
7. Test on desktop viewport

## Done When

- Sidebar hidden on mobile (<640px)
- Sidebar toggleable overlay on tablet (640px-1024px)
- Sidebar static on desktop (>=1024px)
- No duplication with BottomNavigation on mobile
- Navigation works on all breakpoints
- No visual regression on desktop
- TypeScript passes typecheck

## Effort

S (1 hour)

## Depends On

MA-L0-03 (BottomNavigation)
