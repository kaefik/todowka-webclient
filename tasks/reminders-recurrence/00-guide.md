# Task Execution Guide: Reminders and Recurrence

## Project Overview

Implementing task reminders and recurrence for ToDowka GTD task management app.

## Design Documents

- **Design:** `docs/plans/2026-03-15-task-reminders-recurrence-design.md`
- **Implementation Plan:** `docs/plans/2026-03-15-task-reminders-recurrence-implementation.md`

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS 3.0
- **State Management:** Zustand (UI state), TanStack Query (server state)
- **Forms:** React Hook Form + Zod
- **Utilities:** date-fns

## Execution Order

Execute tasks in this order:

```
L0-1 → L2-1 → L2-2 → L1-1 → L1-2 → L1-3 → L1-4 → L1-5 → L3-1 → L3-2 → L3-3 → L3-4 → L4-1 → L4-2 → L4-3 → L5-1 → L5-2 → L5-3
```

## Commands

**After each task:**
```bash
npm run typecheck  # Verify types
npm run lint       # Check code quality
```

**Before committing:**
```bash
npm run typecheck && npm run lint
```

## Task Status

Mark task as completed by adding `[x]` at the beginning of the task file title.

## Commands for Task-Executor

- "следующая задача" - Run next task
- "запусти задачу" - Run specific task
- "что дальше" - Show what's next
- "покажи прогресс" - Show completion status
- "отметь выполненной" - Mark current task as done
- "начни разработку" - Start development from beginning

## Notes

- Follow existing code conventions
- Use TypeScript strict mode
- Maintain mobile responsiveness
- All new components must be in 'use client' mode
- Date/times should be in ISO 8601 format
- Timezone is user-selected (fixed, not browser locale)
