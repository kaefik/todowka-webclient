# Mobile Adaptation — Execution Guide

This guide applies to ALL tasks in this mobile adaptation project. Follow it strictly.

---

## Project Context

**Project:** Todo Web Client — Mobile Adaptation
**Base Project:** GTD Task Management Web Application (Next.js 14, TypeScript, Tailwind CSS)
**Goal:** Adapt existing web application for comfortable mobile phone usage

**Key Design Decisions:**
- Bottom navigation for mobile (6 main items + More menu)
- Action menus (•••) to declutter mobile UI
- Touch-friendly buttons (minimum 44px)
- Responsive layouts throughout

---

## Mobile-First Development Principles

### 1. Breakpoints

Use these Tailwind breakpoints:
- Mobile: default (<640px) — primary target
- Tablet: sm (640px-1024px) — overlay sidebar, full header
- Desktop: lg (>=1024px) — static sidebar, full header

### 2. Touch Targets

**Minimum:** 44px height/width for all interactive elements (Apple HIG)
**Implementation:** Use `size="xs"` for mobile buttons with `min-h-[44px]`

### 3. Visibility Patterns

```tsx
// Mobile only (<640px):
className="flex sm:hidden"

// Tablet+ (>=640px):
className="hidden sm:flex"

// Desktop only (>=1024px):
className="hidden lg:flex"
```

### 4. Responsive Grids

```tsx
// Mobile → tablet → desktop:
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
```

---

## Component Guidelines

### New Components

**TaskActionMenu:**
- Dropdown menu for task actions
- Opens on "•••" button click
- Closes on action click or outside click
- z-index: 60 (above modal)

**MoreMenu:**
- Dropdown for additional navigation items
- Opens on "More" bottom nav item
- Closes on item click or outside click
- z-index: 60

**BottomNavigation:**
- Fixed at bottom on mobile
- 6 items with badges
- Active state highlighting
- z-index: 50 (below menus)

### Component Adaptation

**TaskItem:**
- Mobile: Complete, Next, ActionMenu (•••) buttons
- Desktop: all existing buttons
- Use size="xs" on mobile

**ProjectCard:**
- Mobile: Complete, ActionMenu (•••) buttons
- Desktop: all existing buttons
- Use size="xs" on mobile

**TaskForm:**
- Mobile: 1 column (stacked fields)
- Desktop: 2 columns (side-by-side)

**Modal:**
- Max-height: 90vh
- Internal scrolling
- Responsive margins
- z-index: 50

**Dashboard:**
- Mobile: 1 column stats
- Tablet: 2 columns stats
- Desktop: 3 columns stats

---

## Integration with task-executor

These tasks follow the task-executor format:
- Each task is a separate .md file
- Organized by layer (L0-L3)
- Depends on base project at `/home/oilnur/01-Projects/todo/todowka-webclient`
- All code goes into `/home/oilnur/01-Projects/todo/todowka-webclient/src`

---

## Code Style

Follow the base project's style:
- TypeScript for all files
- Functional components with hooks
- Tailwind CSS only (no custom CSS)
- Named exports (not default)
- Responsive by default (mobile-first)
- Minimal design

---

## Testing

After each task:
1. Type check: `npm run typecheck`
2. Lint: `npm run lint`
3. Manual test in browser
4. Test on mobile viewport (375x667)

---

## Common Patterns

### Conditional Mobile/Desktop Rendering

```tsx
// Mobile only:
<div className="flex sm:hidden">
  {/* Mobile content */}
</div>

// Desktop only:
<div className="hidden sm:flex">
  {/* Desktop content */}
</div>
```

### Touch-Friendly Button

```tsx
<Button size="xs">  // min-h-[44px] px-4 py-3 text-base
  {/* Button content */}
</Button>
```

### Badge Component

```tsx
{count > 0 && (
  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
    {count}
  </span>
)}
```

---

## Import Paths

Use absolute imports from src root:
```typescript
import { Task } from '@/types';
import { useTasks } from '@/lib/hooks/useTasks';
import { Button } from '@/components/ui/Button';
```

---

## When in Doubt

1. Check the mobile adaptation plan: `docs/plans/2026-03-15-mobile-adaptation.md`
2. Follow patterns from base project code
3. Keep it minimal — YAGNI
4. Prioritize mobile experience

---

**Last updated:** 2026-03-15
