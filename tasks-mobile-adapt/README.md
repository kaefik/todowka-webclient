# Mobile Adaptation Tasks

This directory contains step-by-step tasks for adapting the Todo Web Client for mobile devices.

## Overview

Based on the mobile adaptation plan at `docs/plans/2026-03-15-mobile-adaptation.md`, this task set breaks down the implementation into 14 atomic tasks organized into 4 layers.

## Structure

```
tasks-mobile-adapt/
├── 00-guide.md              # Execution guide (READ FIRST)
├── _progress.json           # Progress tracking
├── L0/                      # Foundation (new components)
│   ├── 01-task-action-menu.md
│   ├── 02-more-menu.md
│   ├── 03-bottom-navigation.md
│   └── 04-button-xs-size.md
├── L1/                      # Component Adaptation
│   ├── 01-adapt-taskitem.md
│   ├── 02-adapt-projectcard.md
│   ├── 03-adapt-taskform.md
│   └── 04-adapt-modal.md
├── L2/                      # Page & Layout Adaptation
│   ├── 01-adapt-dashboard.md
│   ├── 02-adapt-header.md
│   ├── 03-adapt-sidebar.md
│   └── 04-adapt-rootlayout.md
└── L3/                      # Optimization & Testing
    ├── 01-optimize-spacing-typography.md
    └── 02-test-mobile-adaptation.md
```

## Using with task-executor

These tasks are designed to work with the **task-executor** skill:

```bash
# Load the task-executor skill
skill task-executor

# Show next task
start next task

# Generate prompt for task
generate prompt

# Mark task as done
mark done

# Show progress
show progress
```

## Task Summary

### L0 — Foundation (4 tasks)
Create new components needed for mobile adaptation:
- TaskActionMenu — dropdown menu for task actions
- MoreMenu — dropdown for additional navigation
- BottomNavigation — bottom nav bar for mobile
- Button xs size — touch-friendly button size

### L1 — Component Adaptation (4 tasks)
Adapt existing components for mobile:
- TaskItem — simplified buttons + action menu
- ProjectCard — simplified buttons + action menu
- TaskForm — responsive grid (1 column on mobile)
- Modal — responsive sizing + scroll

### L2 — Page & Layout Adaptation (4 tasks)
Adapt pages and layout components:
- Dashboard — responsive statistics grid
- Header — hide on mobile
- Sidebar — verify correct behavior
- RootLayout — integrate BottomNavigation

### L3 — Optimization & Testing (2 tasks)
Final optimizations and testing:
- Spacing & typography optimization
- Comprehensive testing on multiple devices

## Progress

Total tasks: 14
- READY: 5 tasks
- BLOCKED: 9 tasks
- DONE: 0 tasks

## Next Steps

1. Load the task-executor skill: `skill task-executor`
2. Check progress: `show progress`
3. Start first task: `start next task`

## Notes

- All tasks follow mobile-first design principles
- Touch targets minimum 44px (Apple HIG)
- Breakpoints: mobile (<640px), tablet (640-1024px), desktop (>=1024px)
- Use `size="xs"` for mobile buttons
- Test on multiple devices before completion

---

Created: 2026-03-15
Based on: `docs/plans/2026-03-15-mobile-adaptation.md`
