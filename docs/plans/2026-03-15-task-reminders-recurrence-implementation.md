# Implementation Plan: Task Reminders and Recurrence

**Source Design:** docs/plans/2026-03-15-task-reminders-recurrence-design.md  
**Generated:** 2026-03-15  
**Total Tasks:** 18  
**Estimated Effort:** ~28 hours

---

## Summary Table

| # | Layer | Task | Effort | Depends on |
|---|-------|------|--------|------------|
| 1 | Foundation | Extend TypeScript types for recurrence | S | — |
| 2 | Services | Create RecurrenceCalculator utility | M | 1 |
| 3 | Services | Create NotificationService class | M | — |
| 4 | UI Components | Create DateTimePicker component | S | 1 |
| 5 | UI Components | Create Toast system | M | — |
| 6 | UI Components | Create ReminderSettings component | S | 1, 4 |
| 7 | UI Components | Create RecurrenceSettings component | M | 1 |
| 8 | UI Components | Create NotificationManager component | M | 2, 3 |
| 9 | API Layer | Extend tasks API client | S | 1 |
| 10 | API Layer | Create useSetReminder hook | S | 9 |
| 11 | API Layer | Create useSetRecurrence hook | S | 9 |
| 12 | API Layer | Create useCompleteTask hook | M | 9 |
| 13 | Integration | Update TaskForm with reminder/recurrence | M | 4, 5, 6, 7, 9, 10, 11 |
| 14 | Integration | Update TaskItem to display reminder/recurrence | S | 1 |
| 15 | Integration | Add NotificationManager and Toast to layout | S | 5, 8 |
| 16 | Testing | Create unit tests for RecurrenceCalculator | M | 2 |
| 17 | Testing | Create unit tests for NotificationService | S | 3 |
| 18 | Testing | End-to-end testing of reminder/recurrence flow | L | All |

---

## Detailed Task Cards

### L0-1 — Extend TypeScript Types

**Goal:** Add recurrence and reminder types to type definitions.
**Input:** Existing `src/types/index.ts` with Task, TaskCreate, TaskUpdate interfaces.
**Output:** Updated `src/types/index.ts` with RecurrenceType, RecurrenceConfig, and extended Task interfaces.
**Done when:** TypeScript compiler accepts the changes without errors and all new fields are defined.
**Est. effort:** S (1h)

**LLM Prompt Hint:**
> Extend the TypeScript types in src/types/index.ts. Add:
> - export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
> - export interface RecurrenceConfig { days_of_week?: number[]; day_of_month?: number; }
> - Extend Task interface with: reminder_enabled: boolean, recurrence_type: RecurrenceType | null, recurrence_config: RecurrenceConfig | null, timezone: string
> - Extend TaskCreate and TaskUpdate with the same fields (all optional)

---

### L2-1 — Create RecurrenceCalculator

**Goal:** Implement date calculation logic for task recurrence.
**Input:** Extended types from L0-1.
**Output:** `src/lib/utils/recurrenceCalculator.ts` with calculateNextDueDate and calculateNextReminderTime functions.
**Done when:** All recurrence types calculate correct next dates, including edge cases (month end, leap year, weekly wrap-around).
**Est. effort:** M (2h)

**LLM Prompt Hint:**
> Create src/lib/utils/recurrenceCalculator.ts with date-fns for date manipulation. Implement:
> - calculateNextDueDate: Takes recurrenceType, recurrenceConfig, currentDueDate, timezone. Returns next due date based on type:
>   * daily: +1 day
>   * weekly: next selected day of week, or same day next week if none selected
>   * monthly: same day of month next month (clamp to month end if needed)
>   * yearly: +1 year
> - calculateWeeklyNextDate: Handle day selection and wrap-around to next week
> - calculateMonthlyNextDate: Handle day-of-month clamping to valid month days
> - calculateNextReminderTime: Calculate next reminder time maintaining offset from due_date
> - Handle edge cases: Jan 31 → Feb 28/29, no days selected in weekly recurrence

---

### L2-2 — Create NotificationService

**Goal:** Implement browser notification management.
**Input:** None (uses browser Notification API).
**Output:** `src/lib/services/NotificationService.ts` with NotificationService class.
**Done when:** Service can request permission, check if notifications can show, and display notifications with proper error handling.
**Est. effort:** M (2h)

**LLM Prompt Hint:**
> Create src/lib/services/NotificationService.ts. Implement a NotificationService class with:
> - init(): Async method that checks Notification API support and requests permission if default
> - canShow(): Returns true if permission is granted
> - requestPermission(): Explicitly requests permission
> - show(title, options): Displays browser notification with icon and badge
> - showReminder(taskTitle, dueDate): Displays task reminder with "due in X minutes" or "at HH:MM" message
> - Handle cases: Notification API unsupported, permission denied, already granted
> - Export singleton instance: export const notificationService = new NotificationService()

---

### L1-1 — Create DateTimePicker

**Goal:** Build reusable date and time picker component.
**Input:** Types from L0-1, existing Input component.
**Output:** `src/components/ui/DateTimePicker.tsx` with DateTimePicker component.
**Done when:** Component renders date and time inputs, combines them into ISO 8601 format, and displays timezone label.
**Est. effort:** S (1h)

**LLM Prompt Hint:**
> Create src/components/ui/DateTimePicker.tsx. Component props: value (string | null), onChange (string | null → void), timezone (string), label, placeholder. Use React state for date and time inputs separately. Handle changes to combine into "YYYY-MM-DDTHH:mm:00Z" format when both date and time are set. Display timezone as small text. Use existing Input component from @/components/ui/Input.

---

### L1-2 — Create Toast System

**Goal:** Build in-app notification toast system.
**Input:** None.
**Output:** `src/components/ui/Toast.tsx` with useToast hook and ToastContainer component.
**Done when:** useToast hook can show toasts, toasts auto-dismiss after 5 seconds, ToastContainer renders toasts with proper styling for each type (info, success, warning, error).
**Est. effort:** M (2h)

**LLM Prompt Hint:**
> Create src/components/ui/Toast.tsx. Implement:
> - Toast interface: id, message, type ('info' | 'success' | 'warning' | 'error')
> - useToast hook: Manages toasts state, show() method to add toast with auto-dismiss after 5000ms
> - ToastContainer component: Fixed position top-right, renders toasts with color-coded backgrounds based on type
> - Use auto-incrementing toastId for unique IDs
> - Tailwind classes: fixed, top-4, right-4, z-50, space-y-2, rounded-lg, shadow-lg

---

### L1-3 — Create ReminderSettings

**Goal:** Build component for configuring task reminders.
**Input:** DateTimePicker from L1-1, types from L0-1.
**Output:** `src/components/task/ReminderSettings.tsx` with ReminderSettings component.
**Done when:** Component shows enable checkbox and DateTimePicker (only when enabled), properly passes props through to parent callbacks.
**Est. effort:** S (1h)

**LLM Prompt Hint:**
> Create src/components/task/ReminderSettings.tsx. Component props: reminderTime (string | null), reminderEnabled (boolean), timezone (string), onReminderTimeChange, onReminderEnabledChange. Render a Checkbox for "Enable reminder" and conditionally render DateTimePicker from @/components/ui/DateTimePicker when reminderEnabled is true. Use border rounded-lg p-4 container. Call appropriate callback props on changes.

---

### L1-4 — Create RecurrenceSettings

**Goal:** Build component for configuring task recurrence.
**Input:** Types from L0-1.
**Output:** `src/components/task/RecurrenceSettings.tsx` with RecurrenceSettings component.
**Done when:** Component shows recurrence type selector, weekly day checkboxes (for weekly type), monthly day selector (for monthly type).
**Est. effort:** M (2h)

**LLM Prompt Hint:**
> Create src/components/task/RecurrenceSettings.tsx. Component props: recurrenceType, recurrenceConfig, onTypeChange, onConfigChange. DAYS_OF_WEEK array with Monday-Sunday. Render:
> - Select dropdown for recurrence type (none, daily, weekly, monthly, yearly)
> - When weekly: Checkboxes for each day of week
> - When monthly: Select dropdown for day of month (1-31)
> - Handle days_of_week array manipulation (add/remove on checkbox change)
> - Handle day_of_month number update
> - Use border rounded-lg p-4 container

---

### L1-5 — Create NotificationManager

**Goal:** Build component that checks and displays task reminders.
**Input:** NotificationService from L2-2, RecurrenceCalculator from L2-1, existing useTasks hook.
**Output:** `src/components/NotificationManager.tsx` with NotificationManager component.
**Done when:** Component checks for due reminders every minute, shows browser notifications, tracks which tasks have been notified to avoid duplicates.
**Est. effort:** M (2h)

**LLM Prompt Hint:**
> Create src/components/NotificationManager.tsx. Use useTasks to fetch all tasks. Use useEffect with useRef for interval and Set for tracked task IDs. Implement checkReminders function that:
> - Filters tasks with reminder_enabled=true, reminder_time set, not completed
> - Checks if reminder_time is within last 60 seconds and not yet shown
> - Calls notificationService.showReminder() for due tasks
> - Adds task ID to checked Set
> - Runs immediately on mount and every 60 seconds via setInterval
> - Cleanup interval on unmount. Call notificationService.init() on mount.

---

### L3-1 — Extend Tasks API Client

**Goal:** Add new API methods for reminders and recurrence.
**Input:** Extended types from L0-1, existing tasksAPI in src/lib/api/tasks.ts.
**Output:** Updated `src/lib/api/tasks.ts` with setReminder, setRecurrence, setTimezone, complete methods.
**Done when:** All new methods are defined with correct TypeScript signatures and API endpoints.
**Est. effort:** S (1h)

**LLM Prompt Hint:**
> Update src/lib/api/tasks.ts. Add to tasksAPI object:
> - setReminder(id, reminderTime, enabled): POST to /tasks/${id}/reminder with {reminder_time, reminder_enabled}
> - setRecurrence(id, recurrenceType, config): POST to /tasks/${id}/recurrence with {recurrence_type, recurrence_config}
> - setTimezone(id, timezone): POST to /tasks/${id}/timezone with {timezone}
> - complete(id, skipRecurrence): POST to /tasks/${id}/complete with {skip_recurrence}, returns {task: Task, nextTask?: Task}
> - Maintain existing methods

---

### L3-2 — Create useSetReminder Hook

**Goal:** React Query hook for setting task reminders.
**Input:** Extended tasksAPI from L3-1.
**Output:** `src/lib/hooks/useTaskReminder.ts` with useSetReminder hook.
**Done when:** Hook returns mutation that calls setReminder API and invalidates ['tasks'] queries on success.
**Est. effort:** S (1h)

**LLM Prompt Hint:**
> Create src/lib/hooks/useTaskReminder.ts. Use useMutation from @tanstack/react-query. MutationFn calls tasksAPI.setReminder with {id, reminderTime, enabled}. onSuccess callback uses queryClient.invalidateQueries(['tasks']). Export useSetReminder hook that returns the mutation result.

---

### L3-3 — Create useSetRecurrence Hook

**Goal:** React Query hook for setting task recurrence.
**Input:** Extended tasksAPI from L3-1.
**Output:** `src/lib/hooks/useTaskRecurrence.ts` with useSetRecurrence hook.
**Done when:** Hook returns mutation that calls setRecurrence API and invalidates ['tasks'] queries on success.
**Est. effort:** S (1h)

**LLM Prompt Hint:**
> Create src/lib/hooks/useTaskRecurrence.ts. Use useMutation from @tanstack/react-query. MutationFn calls tasksAPI.setRecurrence with {id, type, config}. onSuccess callback uses queryClient.invalidateQueries(['tasks']). Export useSetRecurrence hook that returns the mutation result.

---

### L3-4 — Create useCompleteTask Hook

**Goal:** React Query hook for completing tasks with recurrence support.
**Input:** Extended tasksAPI from L3-1.
**Output:** `src/lib/hooks/useCompleteTask.ts` with useCompleteTask hook.
**Done when:** Hook returns mutation that calls complete API and invalidates ['tasks'] queries on success. Handles nextTask in onSuccess.
**Est. effort:** M (2h)

**LLM Prompt Hint:**
> Create src/lib/hooks/useCompleteTask.ts. Use useMutation from @tanstack/react-query. MutationFn calls tasksAPI.complete with {id, skipRecurrence}. onSuccess callback:
> - Uses queryClient.invalidateQueries(['tasks'])
> - Optionally handles data.nextTask (could trigger toast notification)
> Export useCompleteTask hook that returns the mutation result.

---

### L4-1 — Update TaskForm

**Goal:** Integrate reminder and recurrence components into task form.
**Input:** Components from L1-1, L1-3, L1-4, hooks from L3-2, L3-3.
**Output:** Updated `src/components/task/TaskForm.tsx` with new form sections.
**Done when:** Form includes DateTimePicker for due_date, ReminderSettings, RecurrenceSettings, and timezone selector. Form validation includes new fields. Submission includes new fields in data.
**Est. effort:** M (2h)

**LLM Prompt Hint:**
> Update src/components/task/TaskForm.tsx. Add to TaskFormData interface: due_date, reminder_time, reminder_enabled, recurrence_type, recurrence_config, timezone. Extend taskSchema with validation for these fields. Add form sections using:
> - DateTimePicker for due_date
> - ReminderSettings component
> - RecurrenceSettings component
> - Timezone Select dropdown with UTC, Europe/Moscow, America/New_York, Asia/Tokyo
> - Add Controller components from react-hook-form for new fields
> - Ensure handleSubmitWithLog includes new fields in submission data

---

### L4-2 — Update TaskItem

**Goal:** Display reminder and recurrence info in task list.
**Input:** Types from L0-1.
**Output:** Updated `src/components/task/TaskItem.tsx` with reminder/recurrence display.
**Done when:** TaskItem shows reminder icon and time when reminder_enabled, recurrence icon and type when recurrence_type set, and due_date icon and date when due_date set.
**Est. effort:** S (1h)

**LLM Prompt Hint:**
> Update src/components/task/TaskItem.tsx. Add a section that displays task metadata with icons. Show:
> - 🔔 emoji + formatted reminder_time when task.reminder_enabled and task.reminder_time exist
> - 🔄 emoji + task.recurrence_type when task.recurrence_type is set and not 'none'
> - 📅 emoji + formatted due_date when task.due_date exists
> - Use text-xs text-slate-500 styling, flex gap-2 for layout

---

### L4-3 — Add NotificationManager and Toast to Layout

**Goal:** Integrate notification system into app layout.
**Input:** NotificationManager from L1-5, Toast system from L1-2.
**Output:** Updated `src/app/layout.tsx` with NotificationManager and ToastContainer.
**Done when:** Layout renders NotificationManager and ToastContainer components. ToastContainer receives toasts from useToast hook.
**Est. effort:** S (1h)

**LLM Prompt Hint:**
> Update src/app/layout.tsx. Import NotificationManager from @/components/NotificationManager. Import ToastContainer and useToast from @/components/ui/Toast. In RootLayout component:
> - Call const { toasts } = useToast()
> - Add <NotificationManager /> after existing providers
> - Add <ToastContainer toasts={toasts} /> after NotificationManager
> - Ensure these are within <body> tags but before {children}

---

### L5-1 — Test RecurrenceCalculator

**Goal:** Unit tests for date calculation logic.
**Input:** RecurrenceCalculator from L2-1.
**Output:** Test file `src/lib/utils/__tests__/recurrenceCalculator.test.ts` (or Jest/Vitest equivalent).
**Done when:** All recurrence types have test cases including edge cases (month end, leap year, weekly wrap-around, no days selected). All tests pass.
**Est. effort:** M (2h)

**LLM Prompt Hint:**
> Create unit tests for RecurrenceCalculator. Test cases should include:
> - Daily: +1 day calculation
> - Weekly: next selected day, same day next week if none selected, wrap-around to next week
> - Monthly: same day next month, Jan 31 → Feb 28/29, day clamping
> - Yearly: +1 year including leap year handling (Feb 29)
> - calculateNextReminderTime: offset maintenance
> - Use test framework configured in project (check package.json)

---

### L5-2 — Test NotificationService

**Goal:** Unit tests for notification service.
**Input:** NotificationService from L2-2.
**Output:** Test file `src/lib/services/__tests__/NotificationService.test.ts`.
**Done when:** Service initialization, permission checking, notification display, and error handling are tested. Mock Notification API.
**Est. effort:** S (1h)

**LLM Prompt Hint:**
> Create unit tests for NotificationService. Mock the browser Notification API. Test:
> - init() with and without Notification API support
> - canShow() returns correct result based on permission
> - requestPermission() handles granted/denied/default
> - show() displays notification when permitted, logs warning when not
> - showReminder() formats time message correctly
> - Handle API unsupported case

---

### L5-3 — End-to-End Testing

**Goal:** Full integration testing of reminder/recurrence flow.
**Input:** All previous tasks completed.
**Output:** E2E test suite or manual testing checklist verified.
**Done when:** All test checklist items from design document Section 7 are verified (Frontend, Backend, Integration).
**Est. effort:** L (4h)

**LLM Prompt Hint:**
> Create and execute comprehensive tests covering the checklist from design document:
> - Frontend: form rendering, component behavior, UI interactions
> - Backend: API endpoints (if backend is accessible)
> - Integration: create task with recurrence → complete → next task appears
> - Test all recurrence types: daily, weekly, monthly, yearly
> - Test edge cases: month end, leap year, timezone handling
> - Test notifications: browser push, in-app toasts, permission handling
> - Verify tasks can be edited with reminder/recurrence settings
> - Test skip recurrence option in completion dialog

---

## Implementation Notes

### Backend Requirements

The design assumes backend support for these endpoints. If backend is not yet implemented, create corresponding API routes:

- POST `/tasks/{id}/reminder` - Update reminder settings
- POST `/tasks/{id}/recurrence` - Update recurrence settings
- POST `/tasks/{id}/timezone` - Update timezone
- POST `/tasks/{id}/complete` - Complete task and optionally create next occurrence

Backend complete endpoint should:
1. Mark task as completed
2. If recurrence is set and skip_recurrence is false:
   - Calculate next due date using same recurrence logic
   - Create new task with copied fields
   - Set calculated due_date and reminder_time
   - Return both completed task and next_task

### Dependencies

All dependencies already exist in the project:
- date-fns - Date manipulation
- @tanstack/react-query - Server state management
- react-hook-form - Form handling
- @hookform/resolvers - Form validation
- zod - Schema validation

### File Structure Summary

```
src/
├── components/
│   ├── task/
│   │   ├── TaskForm.tsx (update - L4-1)
│   │   ├── TaskItem.tsx (update - L4-2)
│   │   ├── ReminderSettings.tsx (new - L1-3)
│   │   └── RecurrenceSettings.tsx (new - L1-4)
│   ├── ui/
│   │   ├── DateTimePicker.tsx (new - L1-1)
│   │   └── Toast.tsx (new - L1-2)
│   └── NotificationManager.tsx (new - L1-5)
├── lib/
│   ├── api/
│   │   └── tasks.ts (update - L3-1)
│   ├── hooks/
│   │   ├── useTaskReminder.ts (new - L3-2)
│   │   ├── useTaskRecurrence.ts (new - L3-3)
│   │   └── useCompleteTask.ts (new - L3-4)
│   ├── services/
│   │   └── NotificationService.ts (new - L2-2)
│   └── utils/
│       └── recurrenceCalculator.ts (new - L2-1)
└── types/
    └── index.ts (update - L0-1)
```

---

## LLM Execution Guide

To execute this plan with an LLM:

1. **Initial Context:** Provide design document path and project structure
2. **Execute tasks sequentially:** Start with L0-1, then L2-1, L2-2, L1-1, etc.
3. **Between tasks:** Provide the output (file content) from previous task as input to next task
4. **Verification:** After each task, run `npm run typecheck` and `npm run lint` to verify correctness
5. **Final step:** Run tests or verify checklist items manually

**System prompt for each task:**
> You are implementing task reminders and recurrence for a GTD task management app. Use existing code conventions, TypeScript, Tailwind CSS, React Query, React Hook Form, and Zod. Follow the design document at docs/plans/2026-03-15-task-reminders-recurrence-design.md.

**Progress tracking:** Mark tasks as completed and commit after each major milestone (L0, L1, L2, L3, L4).
