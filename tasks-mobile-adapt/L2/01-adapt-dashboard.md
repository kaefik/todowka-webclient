# MA-L2-01 — Adapt Dashboard for mobile

## Goal

Make Dashboard statistics responsive: 3 columns on desktop, 1-2 columns on mobile.

## Input

- Existing `src/app/page.tsx` (Dashboard)

## Output

- Updated Dashboard with responsive grid layout

## Implementation Details

**Current Statistics Layout:**
```tsx
<section className="grid grid-cols-3 gap-4">
```

**New Layout:**
```tsx
<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

**Breakpoints:**
- Mobile (<640px): `grid-cols-1` — full-width cards
- Tablet (640px-1024px): `sm:grid-cols-2` — 2 columns
- Desktop (>=1024px): `lg:grid-cols-3` — 3 columns

**Typography:**
- Ensure headings and text are readable on mobile
- Consider reducing font sizes slightly if needed
- Maintain proper line heights

**Spacing:**
- Keep gap-4 for consistent spacing
- Ensure adequate padding on mobile

**Benefits:**
- Statistics readable on small screens
- No horizontal scrolling
- Maintains desktop layout efficiency

## Steps

1. Read existing Dashboard page
2. Find statistics grid section
3. Replace grid-cols-3 with grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
4. Review typography for mobile readability
5. Test on mobile viewport
6. Test on tablet and desktop viewports

## Done When

- Statistics stack on mobile (1 column)
- 2 columns on tablet (sm:grid-cols-2)
- 3 columns on desktop (lg:grid-cols-3)
- No horizontal scrolling on mobile
- No visual regression on tablet/desktop
- Typography readable on mobile
- TypeScript passes typecheck

## Effort

XS (30 minutes)

## Depends On

None
