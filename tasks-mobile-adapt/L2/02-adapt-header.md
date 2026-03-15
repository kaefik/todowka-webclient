# MA-L2-02 — Adapt Header for mobile

## Goal

Ensure Header is hidden on mobile devices when BottomNavigation is shown, visible on tablet/desktop.

## Input

- Existing `src/components/layout/Header.tsx`

## Output

- Updated Header with mobile visibility classes

## Implementation Details

**Current Layout:**
- Header visible on all breakpoints
- Contains navigation controls

**New Layout:**
- Header hidden on mobile (<640px) — `hidden sm:flex`
- Header visible on tablet/desktop (>=640px)

**Rationale:**
- Mobile uses BottomNavigation for navigation
- Header is redundant on mobile
- Saves screen real estate
- Improves UX by removing duplication

**Implementation:**
```tsx
// Add to Header's root div:
<Header className="hidden sm:flex">
```

**Alternative Options:**
1. Create separate MobileHeader component (rejected — use BottomNavigation)
2. Show compact header on mobile (rejected — BottomNavigation is better)
3. Hide Header completely (rejected — needed on desktop)

**Considerations:**
- Ensure Header functionality available elsewhere on mobile
- BottomNavigation covers mobile navigation
- Any Header-specific features should be available on mobile (if any)

## Steps

1. Read existing Header component
2. Add visibility classes: `hidden sm:flex`
3. Verify Header still visible on tablet/desktop
4. Verify BottomNavigation visible on mobile
5. Test navigation on mobile
6. Test navigation on desktop

## Done When

- Header hidden on mobile (<640px)
- Header visible on tablet/desktop (>=640px)
- Navigation works on both mobile (BottomNavigation) and desktop (Header)
- No loss of functionality
- No visual regression on desktop
- TypeScript passes typecheck

## Effort

XS (15 minutes)

## Depends On

MA-L0-03 (BottomNavigation)
