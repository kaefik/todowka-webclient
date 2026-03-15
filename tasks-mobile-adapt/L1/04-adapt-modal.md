# MA-L1-04 — Adapt Modal for mobile

## Goal

Improve Modal component responsiveness on mobile devices with better sizing and scroll behavior.

## Input

- Existing `src/components/ui/Modal.tsx`

## Output

- Updated `src/components/ui/Modal.tsx` with mobile-friendly sizing

## Implementation Details

**Current Container:**
```tsx
<div className="relative z-10 w-full max-w-lg mx-4">
```

**New Container:**
```tsx
<div className="relative z-10 w-full max-w-2xl mx-4 sm:mx-6 md:mx-8 max-h-[90vh] overflow-y-auto">
```

**Changes:**
1. Increase max-width: `max-w-lg` → `max-w-2xl`
   - More space for content on larger screens
   - Still responsive on mobile

2. Responsive margins: `mx-4` → `mx-4 sm:mx-6 md:mx-8`
   - Mobile: 1rem margins
   - Tablet: 1.5rem margins
   - Desktop: 2rem margins

3. Add max-height and scroll: `max-h-[90vh] overflow-y-auto`
   - Prevent modal from exceeding viewport
   - Enable scrolling within modal
   - Critical for mobile with small screens

**Backdrop:**
- Ensure backdrop covers full viewport
- Handle touch events properly (prevent scroll on backdrop)

**Accessibility:**
- Maintain focus trapping
- Maintain close on Escape key
- Maintain close on backdrop click

**Z-index:**
- Keep modal at z-50 (below menus at z-60)

## Steps

1. Read existing Modal component
2. Update container styles
3. Add max-height and overflow
4. Update margins for responsive
5. Test on mobile viewport
6. Test scroll behavior
7. Test on desktop viewport

## Done When

- Modal fits within viewport on mobile
- Content scrolls within modal when tall
- Backdrop properly blocks scrolling
- No visual regression on desktop
- All modal interactions preserved
- Accessibility maintained
- TypeScript passes typecheck

## Effort

M (1 hour)

## Depends On

None
