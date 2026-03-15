# MA-L2-04 — Adapt RootLayout for BottomNavigation

## Goal

Integrate BottomNavigation into RootLayout with conditional rendering for mobile/tablet/desktop.

## Input

- Existing `src/app/layout.tsx`
- New `src/components/layout/BottomNavigation.tsx` from MA-L0-03
- Updated Header from MA-L2-02
- Updated Sidebar from MA-L2-03

## Output

- Updated RootLayout with BottomNavigation integration

## Implementation Details

**Current Layout Structure:**
```tsx
<div className="flex min-h-screen">
  <Sidebar />
  <div className="flex-1 flex flex-col">
    <Header />
    <MainContent>{children}</MainContent>
  </div>
</div>
```

**New Layout Structure:**
```tsx
<div className="flex min-h-screen flex-col">
  <Header className="hidden sm:flex" />  // Tablet/desktop only
  <div className="flex flex-1">
    <Sidebar className="hidden lg:flex" />  // Desktop only
    <MainContent className="flex-1 pb-16 sm:pb-0">{children}</MainContent>
  </div>
  <BottomNavigation className="flex sm:hidden" />  // Mobile only
</div>
```

**Key Changes:**
1. Outer container: `flex flex-col` (vertical stack)
2. Header: `hidden sm:flex` (tablet/desktop only)
3. Sidebar: `hidden lg:flex` (desktop only)
4. BottomNavigation: `flex sm:hidden` (mobile only)
5. MainContent padding: `pb-16` on mobile for bottom nav clearance

**Breakpoint Behavior:**

**Mobile (<640px):**
- Header: hidden
- Sidebar: hidden
- BottomNavigation: visible (6 items)
- MainContent: extra padding-bottom for nav

**Tablet (640px-1024px):**
- Header: visible
- Sidebar: overlay (toggleable)
- BottomNavigation: hidden
- MainContent: normal padding

**Desktop (>=1024px):**
- Header: visible
- Sidebar: visible (static)
- BottomNavigation: hidden
- MainContent: normal padding

**Imports:**
```tsx
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MainContent } from '@/components/layout/MainContent';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
```

## Steps

1. Read existing RootLayout
2. Add BottomNavigation import
3. Update outer container structure
4. Add conditional classes to Header
5. Add conditional classes to Sidebar
6. Add BottomNavigation with mobile-only classes
7. Add padding to MainContent for mobile
8. Test on all breakpoints

## Done When

- BottomNavigation visible only on mobile (<640px)
- Header visible on tablet/desktop (>=640px)
- Sidebar static on desktop (>=1024px), overlay on tablet (640px-1024px)
- MainContent has adequate padding on mobile
- Navigation works on all breakpoints
- No overlapping elements
- No visual regression on desktop
- TypeScript passes typecheck

## Effort

M (1.5 hours)

## Depends On

MA-L0-03 (BottomNavigation), MA-L2-02 (Header), MA-L2-03 (Sidebar)
