# MA-L3-01 — Optimize spacing and typography for mobile

## Goal

Review and optimize all components for mobile readability: padding, margins, font sizes, and spacing.

## Input

- All components adapted in previous tasks
- Mobile design best practices

## Output

- Optimized spacing and typography across all components

## Implementation Details

**Components to Review:**
1. TaskItem
2. ProjectCard
3. TaskForm
4. Modal
5. Dashboard
6. BottomNavigation
7. All list views

**Optimization Areas:**

**Typography:**
- Font sizes: Ensure minimum 16px for body text
- Line heights: 1.5-1.6 for readability
- Headings: Scale down proportionally on mobile
- Truncate long text with ellipsis

**Spacing:**
- Padding: Reduce on mobile (e.g., p-4 → p-3 on mobile)
- Margins: Adjust for small screens
- Gap: Reduce in grids (e.g., gap-4 → gap-2 on mobile)
- Button spacing: Ensure adequate touch targets

**Specific Optimizations:**

**TaskItem:**
- Title: text-base, truncate long titles
- Description: text-sm, limit lines
- Button spacing: gap-2 is adequate

**ProjectCard:**
- Title: text-base, truncate
- Stats: text-sm
- Button spacing: gap-2 is adequate

**TaskForm:**
- Labels: text-sm, adequate spacing
- Inputs: text-base for readability
- Help text: text-xs, clear contrast

**Modal:**
- Title: text-lg on mobile
- Body: text-base
- Padding: reduced on mobile (p-4 → p-3)

**Dashboard:**
- Stat cards: stacked on mobile
- Values: text-2xl on mobile
- Labels: text-sm

**BottomNavigation:**
- Labels: text-xs for compactness
- Icons: maintain size
- Badge: small but readable

**General Patterns:**
```tsx
// Mobile-first typography:
className="text-sm sm:text-base"

// Mobile-first spacing:
className="p-3 sm:p-4"

// Truncate long text:
className="truncate"
```

## Steps

1. Review TaskItem for typography/spacing
2. Review ProjectCard for typography/spacing
3. Review TaskForm for typography/spacing
4. Review Modal for typography/spacing
5. Review Dashboard for typography/spacing
6. Review BottomNavigation for typography/spacing
7. Review list views for typography/spacing
8. Test on mobile viewport (375px)
9. Test on small phone (320px if possible)

## Done When

- All text readable on mobile (16px minimum)
- Spacing optimized for small screens
- No horizontal scrolling
- Long text truncated appropriately
- Touch targets remain adequate (44px minimum)
- No visual regression on desktop
- Consistent typography system
- TypeScript passes typecheck

## Effort

M (2 hours)

## Depends On

MA-L1 (Component Adaptation), MA-L2 (Page & Layout Adaptation)
