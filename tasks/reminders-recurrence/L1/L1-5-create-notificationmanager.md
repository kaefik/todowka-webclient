# [L1-5] Create NotificationManager

## Status
[ ] Pending

## Goal
Build component that checks and displays task reminders.

## Input
- NotificationService from L2-2
- RecurrenceCalculator from L2-1
- Existing useTasks hook

## Output
`src/components/NotificationManager.tsx` with NotificationManager component.

## Done when
- Component fetches all tasks
- Checks for due reminders every minute
- Shows browser notifications for due tasks
- Tracks notified tasks to avoid duplicates
- Cleans up interval on unmount
- Component is properly typed

## Implementation Details

### File Structure

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { useTasks } from '@/lib/hooks/useTasks';
import { notificationService } from '@/lib/services/NotificationService';

export function NotificationManager() {
  // Implementation
}
```

### Component State

```tsx
const { data: tasks } = useTasks();
const intervalRef = useRef<NodeJS.Timeout>();
const checkedTasks = useRef<Set<number>>(new Set());
```

### Initialize NotificationService

```tsx
useEffect(() => {
  notificationService.init();
}, []);
```

### Check Reminders Function

```tsx
const checkReminders = () => {
  const now = Date.now();
  const checkWindow = 60000; // Check every minute

  tasks.forEach(task => {
    // Skip if reminder not enabled, no time set, or task is completed
    if (!task.reminder_enabled || !task.reminder_time || task.completed) return;

    const reminderTime = new Date(task.reminder_time).getTime();
    const timeDiff = reminderTime - now;

    // Show reminder if within check window and not yet shown
    if (timeDiff <= 0 && timeDiff > -checkWindow && !checkedTasks.current.has(task.id)) {
      notificationService.showReminder(task.title, task.due_date || task.reminder_time);
      checkedTasks.current.add(task.id);
    }
  });
};
```

### Interval Setup

```tsx
useEffect(() => {
  if (!tasks) return;

  checkReminders();
  intervalRef.current = setInterval(checkReminders, 60000);

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, [tasks]);
```

### Return

```tsx
return null;
```

### Key Features

- Runs `checkReminders()` immediately on mount
- Checks every 60 seconds via `setInterval`
- Only shows each reminder once (tracked in Set)
- Cleans up interval on unmount
- Handles case when tasks are undefined

## Validation

Run these commands after implementation:

```bash
npm run typecheck
npm run lint
```

## Dependencies
- L2-1: RecurrenceCalculator
- L2-2: NotificationService

## Estimated Time
2 hours
