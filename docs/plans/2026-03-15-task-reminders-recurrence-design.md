# Task Reminders and Recurrence Design

**Date:** 2026-03-15  
**Status:** Approved  
**Approach:** Enhanced Frontend + Backend Schema Extension

## Overview

Design for adding task reminder dates/times, enabling tasks with and without reminders, and implementing task recurrence modes: no repetition, daily, weekly (with day selection), monthly, and yearly.

## Requirements

- **Primary Goal:** Personal GTD task management
- **Notification Type:** Both in-app and browser push notifications
- **Recurrence Behavior:** Create new task on completion
- **Date/Time Fields:** Separate fields for due_date and reminder_time
- **Weekly Recurrence:** Each selected day independently
- **Monthly Recurrence:** Day of month (1-31)
- **Timezone Handling:** Fixed timezone (user-selected)

## Technical Approach

**Selected:** Approach 2 - Enhanced Frontend + Backend Schema Extension

This approach balances functionality and complexity, enabling:
- Backend can send notifications at reminder_time
- Reliable creation of recurring tasks
- Both in-app and browser push notifications
- Future scalability without over-engineering

---

## Section 1: Data Types (TypeScript)

### Types Extension

```typescript
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurrenceConfig {
  days_of_week?: number[];  // [0-6] where 0 = Sunday, or [1-7] where 1 = Monday
  day_of_month?: number;    // 1-31
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;                    // ISO 8601: '2026-03-20T14:30:00Z'
  reminder_time?: string;                // ISO 8601, may be before due_date
  reminder_enabled: boolean;             // whether reminder is enabled
  recurrence_type: RecurrenceType | null;
  recurrence_config: RecurrenceConfig | null;
  timezone: string;                      // e.g., 'Europe/Moscow', 'UTC'
  is_next_action: boolean;
  waiting_for?: string;
  delegated_to?: string;
  someday: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  project_id?: number;
  context_id?: number;
  area_id?: number;
  tags: Tag[];
  deleted_at?: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: number | null;
  context_id?: number | null;
  tag_ids?: number[];
  is_next_action?: boolean;
  waiting_for?: string;
  due_date?: string;
  reminder_time?: string;
  reminder_enabled?: boolean;
  recurrence_type?: RecurrenceType | null;
  recurrence_config?: RecurrenceConfig | null;
  timezone?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  reminder_time?: string;
  reminder_enabled?: boolean;
  is_next_action?: boolean;
  waiting_for?: string | null;
  delegated_to?: string;
  someday?: boolean;
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
  project_id?: number | null;
  context_id?: number | null;
  area_id?: number | null;
  tag_ids?: number[];
  recurrence_type?: RecurrenceType | null;
  recurrence_config?: RecurrenceConfig | null;
  timezone?: string;
}
```

---

## Section 2: API Endpoints

### Extended Tasks API

```typescript
// src/lib/api/tasks.ts
export const tasksAPI = {
  // ... existing methods ...

  async setReminder(id: number, reminderTime: string | null, enabled: boolean): Promise<Task> {
    return api.post<Task>(`/tasks/${id}/reminder`, { 
      reminder_time: reminderTime,
      reminder_enabled: enabled 
    });
  },

  async setRecurrence(id: number, recurrenceType: RecurrenceType | null, config: RecurrenceConfig | null): Promise<Task> {
    return api.post<Task>(`/tasks/${id}/recurrence`, { 
      recurrence_type: recurrenceType,
      recurrence_config: config 
    });
  },

  async setTimezone(id: number, timezone: string): Promise<Task> {
    return api.post<Task>(`/tasks/${id}/timezone`, { timezone });
  },

  async complete(id: number, skipRecurrence = false): Promise<{ task: Task; nextTask?: Task }> {
    return api.post(`/tasks/${id}/complete`, { skip_recurrence: skipRecurrence });
  },
};
```

### React Query Hooks

```typescript
// src/lib/hooks/useTaskReminder.ts
export function useSetReminder() {
  return useMutation({
    mutationFn: ({ id, reminderTime, enabled }: { id: number; reminderTime: string | null; enabled: boolean }) =>
      tasksAPI.setReminder(id, reminderTime, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });
}

// src/lib/hooks/useTaskRecurrence.ts
export function useSetRecurrence() {
  return useMutation({
    mutationFn: ({ id, type, config }: { id: number; type: RecurrenceType | null; config: RecurrenceConfig | null }) =>
      tasksAPI.setRecurrence(id, type, config),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });
}

// src/lib/hooks/useCompleteTask.ts (extended)
export function useCompleteTask() {
  return useMutation({
    mutationFn: ({ id, skipRecurrence }: { id: number; skipRecurrence?: boolean }) =>
      tasksAPI.complete(id, skipRecurrence),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['tasks']);
      if (data.nextTask) {
        // Optional: show notification about next task creation
      }
    },
  });
}
```

### Backend API Specifications

**POST `/tasks/{id}/reminder`**
- Updates task reminder settings
- Request: `{ reminder_time: string | null, reminder_enabled: boolean }`
- Response: `Task`

**POST `/tasks/{id}/recurrence`**
- Updates task recurrence settings
- Request: `{ recurrence_type: RecurrenceType | null, recurrence_config: RecurrenceConfig | null }`
- Response: `Task`

**POST `/tasks/{id}/timezone`**
- Updates task timezone
- Request: `{ timezone: string }`
- Response: `Task`

**POST `/tasks/{id}/complete`**
- Completes task and optionally creates next occurrence
- Request: `{ skip_recurrence: boolean }`
- Response: `{ task: Task, next_task?: Task }`

---

## Section 3: UI Components

### DateTimePicker Component

**File:** `src/components/ui/DateTimePicker.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';

interface DateTimePickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  timezone: string;
  label?: string;
  placeholder?: string;
}

export function DateTimePicker({ value, onChange, timezone, label, placeholder = 'Select date and time' }: DateTimePickerProps) {
  const [dateInput, setDateInput] = useState(value ? value.slice(0, 10) : '');
  const [timeInput, setTimeInput] = useState(value ? value.slice(11, 16) : '');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDateInput(newDate);
    if (newDate && timeInput) {
      onChange(`${newDate}T${timeInput}:00Z`);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeInput(newTime);
    if (dateInput && newTime) {
      onChange(`${dateInput}T${newTime}:00Z`);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}
      <div className="flex gap-2">
        <Input type="date" value={dateInput} onChange={handleDateChange} className="flex-1" />
        <Input type="time" value={timeInput} onChange={handleTimeChange} className="w-32" />
      </div>
      <p className="text-xs text-slate-500">Timezone: {timezone}</p>
    </div>
  );
}
```

### ReminderSettings Component

**File:** `src/components/task/ReminderSettings.tsx`

```tsx
'use client';

import { Checkbox } from '@/components/ui/Checkbox';
import { DateTimePicker } from '@/components/ui/DateTimePicker';

interface ReminderSettingsProps {
  reminderTime: string | null;
  reminderEnabled: boolean;
  timezone: string;
  onReminderTimeChange: (time: string | null) => void;
  onReminderEnabledChange: (enabled: boolean) => void;
}

export function ReminderSettings({ 
  reminderTime, 
  reminderEnabled, 
  timezone, 
  onReminderTimeChange, 
  onReminderEnabledChange 
}: ReminderSettingsProps) {
  return (
    <div className="space-y-3 border rounded-lg p-4">
      <div className="flex items-center gap-2">
        <Checkbox
          label="Enable reminder"
          checked={reminderEnabled}
          onChange={onReminderEnabledChange}
        />
      </div>
      
      {reminderEnabled && (
        <DateTimePicker
          value={reminderTime}
          onChange={onReminderTimeChange}
          timezone={timezone}
          label="Reminder time"
          placeholder="Set reminder time"
        />
      )}
    </div>
  );
}
```

### RecurrenceSettings Component

**File:** `src/components/task/RecurrenceSettings.tsx`

```tsx
'use client';

import { Select, SelectItem } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import type { RecurrenceType, RecurrenceConfig } from '@/types';

const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 0, label: 'Sunday' },
];

interface RecurrenceSettingsProps {
  recurrenceType: RecurrenceType | null;
  recurrenceConfig: RecurrenceConfig | null;
  onTypeChange: (type: RecurrenceType | null) => void;
  onConfigChange: (config: RecurrenceConfig | null) => void;
}

export function RecurrenceSettings({ 
  recurrenceType, 
  recurrenceConfig, 
  onTypeChange, 
  onConfigChange 
}: RecurrenceSettingsProps) {
  const handleDaysOfWeekChange = (day: number, checked: boolean) => {
    const currentDays = recurrenceConfig?.days_of_week || [];
    const newDays = checked 
      ? [...currentDays, day]
      : currentDays.filter(d => d !== day);
    onConfigChange({ ...recurrenceConfig, days_of_week: newDays });
  };

  const handleDayOfMonthChange = (day: string) => {
    const dayNum = parseInt(day);
    onConfigChange({ ...recurrenceConfig, day_of_month: isNaN(dayNum) ? undefined : dayNum });
  };

  return (
    <div className="space-y-3 border rounded-lg p-4">
      <div>
        <label className="block text-sm font-medium mb-1">Repeat</label>
        <Select
          value={recurrenceType || ''}
          onChange={(value) => onTypeChange(value === '' ? null : value as RecurrenceType)}
        >
          <SelectItem value="">No repeat</SelectItem>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="yearly">Yearly</SelectItem>
        </Select>
      </div>

      {recurrenceType === 'weekly' && (
        <div>
          <label className="block text-sm font-medium mb-2">Repeat on</label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map(day => (
              <Checkbox
                key={day.value}
                label={day.label}
                checked={recurrenceConfig?.days_of_week?.includes(day.value) || false}
                onChange={(checked) => handleDaysOfWeekChange(day.value, checked)}
              />
            ))}
          </div>
        </div>
      )}

      {recurrenceType === 'monthly' && (
        <div>
          <label className="block text-sm font-medium mb-1">Day of month</label>
          <Select
            value={recurrenceConfig?.day_of_month?.toString() || ''}
            onChange={handleDayOfMonthChange}
          >
            <SelectItem value="">Select day</SelectItem>
            {Array.from({ length: 31 }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
}
```

---

## Section 4: Notification System

### NotificationService

**File:** `src/lib/services/NotificationService.ts`

```typescript
class NotificationService {
  private permission: NotificationPermission = 'default';

  async init(): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return;
    }

    this.permission = Notification.permission;

    if (this.permission === 'default') {
      this.permission = await Notification.requestPermission();
    }
  }

  canShow(): boolean {
    return this.permission === 'granted';
  }

  async requestPermission(): Promise<NotificationPermission> {
    this.permission = await Notification.requestPermission();
    return this.permission;
  }

  show(title: string, options: NotificationOptions = {}): void {
    if (!this.canShow()) {
      console.warn('Notification permission not granted');
      return;
    }

    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  }

  showReminder(taskTitle: string, dueDate: string): void {
    const timeUntilDue = new Date(dueDate).getTime() - Date.now();
    const timeStr = timeUntilDue < 3600000 
      ? `in ${Math.floor(timeUntilDue / 60000)} minutes`
      : `at ${new Date(dueDate).toLocaleTimeString()}`;

    this.show('Task Reminder', {
      body: `"${taskTitle}" is due ${timeStr}`,
      tag: `task-reminder-${taskTitle}`,
      requireInteraction: true,
    });
  }
}

export const notificationService = new NotificationService();
```

### NotificationManager Component

**File:** `src/components/NotificationManager.tsx`

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { useTasks } from '@/lib/hooks/useTasks';
import { notificationService } from '@/lib/services/NotificationService';

export function NotificationManager() {
  const { data: tasks } = useTasks();
  const intervalRef = useRef<NodeJS.Timeout>();
  const checkedTasks = useRef<Set<number>>(new Set());

  useEffect(() => {
    notificationService.init();
  }, []);

  useEffect(() => {
    if (!tasks) return;

    const checkReminders = () => {
      const now = Date.now();
      const checkWindow = 60000; // Check every minute

      tasks.forEach(task => {
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

    checkReminders();
    intervalRef.current = setInterval(checkReminders, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [tasks]);

  return null;
}
```

### In-App Toast Notifications

**File:** `src/components/ui/Toast.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = (message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${toastId++}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  return { toasts, show };
}

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div key={toast.id} className={`p-4 rounded-lg shadow-lg ${
          toast.type === 'error' ? 'bg-red-500 text-white' :
          toast.type === 'success' ? 'bg-green-500 text-white' :
          toast.type === 'warning' ? 'bg-yellow-500 text-white' :
          'bg-slate-700 text-white'
        }`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
```

### Layout Integration

Add to `src/app/layout.tsx`:

```tsx
import { NotificationManager } from '@/components/NotificationManager';
import { ToastContainer, useToast } from '@/components/ui/Toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { toasts } = useToast();

  return (
    <html lang="ru">
      <body>
        {/* ... existing providers ... */}
        <NotificationManager />
        <ToastContainer toasts={toasts} />
        {children}
      </body>
    </html>
  );
}
```

---

## Section 5: Recurrence Logic

### RecurrenceCalculator

**File:** `src/lib/utils/recurrenceCalculator.ts`

```typescript
import type { RecurrenceType, RecurrenceConfig } from '@/types';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

interface CalculateNextDateParams {
  recurrenceType: RecurrenceType;
  recurrenceConfig: RecurrenceConfig;
  currentDueDate: Date;
  timezone: string;
}

export function calculateNextDueDate({
  recurrenceType,
  recurrenceConfig,
  currentDueDate,
  timezone,
}: CalculateNextDateParams): Date | null {
  if (recurrenceType === 'none' || !recurrenceType) {
    return null;
  }

  const baseDate = new Date(currentDueDate);

  switch (recurrenceType) {
    case 'daily':
      return addDays(baseDate, 1);

    case 'weekly':
      return calculateWeeklyNextDate(baseDate, recurrenceConfig);

    case 'monthly':
      return calculateMonthlyNextDate(baseDate, recurrenceConfig);

    case 'yearly':
      return addYears(baseDate, 1);

    default:
      return null;
  }
}

function calculateWeeklyNextDate(baseDate: Date, config: RecurrenceConfig): Date {
  const daysOfWeek = config.days_of_week || [];
  
  if (daysOfWeek.length === 0) {
    return addWeeks(baseDate, 1);
  }

  const currentDay = baseDate.getDay();
  const sortedDays = [...daysOfWeek].sort((a, b) => a - b);

  // Find next day of week
  const nextDay = sortedDays.find(day => day > currentDay);
  
  if (nextDay !== undefined) {
    const daysToAdd = nextDay - currentDay;
    return addDays(baseDate, daysToAdd);
  }

  // If no more days this week, go to first day next week
  const daysToNextWeek = (7 - currentDay) + sortedDays[0];
  return addDays(baseDate, daysToNextWeek);
}

function calculateMonthlyNextDate(baseDate: Date, config: RecurrenceConfig): Date {
  const dayOfMonth = config.day_of_month || baseDate.getDate();
  
  let nextDate = addMonths(baseDate, 1);
  nextDate.setDate(Math.min(dayOfMonth, new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()));
  
  return nextDate;
}

export function calculateNextReminderTime(
  currentReminderTime: Date,
  nextDueDate: Date,
  currentDueDate: Date
): Date | null {
  if (!currentReminderTime) return null;

  const timeDiff = currentDueDate.getTime() - currentReminderTime.getTime();
  return new Date(nextDueDate.getTime() - timeDiff);
}
```

### Backend Complete Logic

**POST `/tasks/{id}/complete` - Backend Logic:**

1. Update task status to 'completed' and set completed_at
2. If `skip_recurrence === false` and task has recurrence:
   - Calculate next due date using recurrence calculator
   - Create new task with copied fields:
     - title, description
     - project_id, context_id, area_id
     - tags (as array)
     - priority
     - is_next_action (copy if applicable)
     - recurrence_type, recurrence_config, timezone
     - status: 'active' (or inherit based on workflow)
   - Update new task's due_date to calculated next date
   - Update new task's reminder_time (if reminder_enabled) maintaining same offset
   - Set new task's created_at to now
   - Return both completed task and new next_task
3. If `skip_recurrence === true` or no recurrence:
   - Return only completed task

---

## Section 6: Integration

### TaskForm Updates

Key additions to `src/components/task/TaskForm.tsx`:

1. **Extended Form Data Schema:**
   - Add due_date, reminder_time, reminder_enabled
   - Add recurrence_type, recurrence_config, timezone
   - Update Zod validation

2. **New Form Sections:**
   - DateTimePicker for due_date selection
   - ReminderSettings component for reminder toggle and time
   - RecurrenceSettings component for repeat configuration
   - Timezone selector dropdown

3. **Form Submission:**
   - Include new fields in submission data
   - Handle null values appropriately

### TaskItem Updates

Display in `src/components/task/TaskItem.tsx`:

```tsx
<div className="flex items-center gap-2 text-xs text-slate-500">
  {task.reminder_enabled && task.reminder_time && (
    <span>🔔 {new Date(task.reminder_time).toLocaleString()}</span>
  )}
  {task.recurrence_type && task.recurrence_type !== 'none' && (
    <span>🔄 {task.recurrence_type}</span>
  )}
  {task.due_date && (
    <span>📅 {new Date(task.due_date).toLocaleDateString()}</span>
  )}
</div>
```

### Complete Task Flow

Update task completion handling:

```tsx
const completeTask = useCompleteTask();

const handleComplete = async (skipRecurrence = false) => {
  if (task.recurrence_type && task.recurrence_type !== 'none' && !skipRecurrence) {
    setShowSkipRecurrenceDialog(true);
    return;
  }

  await completeTask.mutateAsync({ id: task.id, skipRecurrence });
};
```

Show dialog for recurring tasks allowing user to choose between creating next occurrence or skipping.

---

## Section 7: Testing Checklist

### Frontend Testing

- [ ] TaskForm displays DateTimePicker, ReminderSettings, RecurrenceSettings correctly
- [ ] Can select due_date without enabling reminder
- [ ] Can enable reminder and set reminder_time independently
- [ ] Weekly recurrence allows selecting multiple days of week
- [ ] Monthly recurrence allows selecting day of month
- [ ] Task creation sends reminder and recurrence data to backend
- [ ] Task editing loads and displays reminder/recurrence data correctly
- [ ] Browser notification permission requested on first use
- [ ] Browser notifications appear at reminder_time
- [ ] In-app toast notifications display correctly
- [ ] Task completion dialog appears for recurring tasks
- [ ] New task created with correct next due date on completion

### Backend Testing

- [ ] POST /tasks creates task with reminder and recurrence fields
- [ ] PATCH /tasks/{id} updates reminder and recurrence settings
- [ ] POST /tasks/{id}/complete creates next task for recurrence
- [ ] POST /tasks/{id}/reminder updates reminder settings
- [ ] POST /tasks/{id}/recurrence updates recurrence settings
- [ ] POST /tasks/{id}/timezone updates timezone
- [ ] Completed task status updated correctly
- [ ] Next task fields copied correctly (title, description, tags, project, context)
- [ ] Next task due_date calculated correctly for all recurrence types
- [ ] Next task reminder_time calculated maintaining same offset

### Integration Testing

- [ ] Create task with recurrence → complete → next task appears in list
- [ ] Daily recurrence: next day calculated correctly
- [ ] Weekly recurrence: next selected day calculated correctly
- [ ] Weekly recurrence: wraps to next week correctly
- [ ] Monthly recurrence: next month same day calculated correctly
- [ ] Monthly recurrence: handles month end correctly (e.g., Jan 31 → Feb 28/29)
- [ ] Yearly recurrence: next year same date calculated correctly
- [ ] Reminder offset maintained across recurrence
- [ ] Timezone applied correctly to dates
- [ ] Browser notifications triggered at correct time
- [ ] In-app notifications appear in UI
- [ ] Skip recurrence option works correctly

---

## Section 8: Edge Cases and Considerations

### Date/Time Edge Cases

- **Month End Handling:** Monthly recurrence for 31st → 30th or 28th
- **Leap Years:** February 29th recurrence
- **Daylight Saving Time:** Fixed timezone unaffected by DST changes
- **Timezone Changes:** Existing tasks keep their timezone, new tasks use current selection

### Recurrence Edge Cases

- **No Days Selected:** Weekly recurrence defaults to same day next week
- **Invalid Day of Month:** Invalid days clamped to valid range
- **Completed Recurring Tasks:** Can still be edited before completion
- **Skipping Recurrence:** User can opt to not create next occurrence

### Notification Edge Cases

- **Browser Permission Denied:** Gracefully fallback to in-app only
- **Notifications API Unsupported:** Log warning, continue without push notifications
- **Past Due Reminders:** Show immediately on next check
- **Multiple Reminders:** Each reminder shown once per task

### User Experience

- **Task with Due Date Only:** No reminder shown
- **Task with Reminder Only:** Reminder_time serves as due_date effectively
- **Task with Both:** Due_date independent of reminder_time
- **Completing Overdue Task:** Next occurrence calculated from due_date (not completed_at)

---

## Section 9: Future Enhancements

### Potential Future Features

- Custom recurrence intervals (e.g., every 2 weeks, every 3 months)
- Recurrence end date (stop after X occurrences or specific date)
- Reminder advance options (5 min, 15 min, 1 hour, 1 day, 1 week before)
- Location-based reminders
- Email notifications in addition to push notifications
- Recurrence templates (saved recurrence patterns)
- Bulk edit recurrence settings for multiple tasks
- Recurrence statistics and calendar view

### Performance Considerations

- Client-side reminder checking runs every minute
- Consider backend scheduler for large user bases
- Debounce timezone changes to avoid excessive updates

---

## Implementation Notes

### Dependencies

- `date-fns` - Date manipulation (already in use)
- Existing React Query, React Hook Form, Zod setup

### File Structure

```
src/
├── components/
│   ├── task/
│   │   ├── TaskForm.tsx (updated)
│   │   ├── TaskItem.tsx (updated)
│   │   ├── ReminderSettings.tsx (new)
│   │   └── RecurrenceSettings.tsx (new)
│   ├── ui/
│   │   ├── DateTimePicker.tsx (new)
│   │   └── Toast.tsx (new)
│   └── NotificationManager.tsx (new)
├── lib/
│   ├── api/
│   │   └── tasks.ts (updated)
│   ├── hooks/
│   │   ├── useTaskReminder.ts (new)
│   │   ├── useTaskRecurrence.ts (new)
│   │   └── useCompleteTask.ts (updated)
│   ├── services/
│   │   └── NotificationService.ts (new)
│   └── utils/
│       └── recurrenceCalculator.ts (new)
└── types/
    └── index.ts (updated)
```

---

## Approval Status

**Approved by:** User  
**Date:** 2026-03-15  
**Approach:** Enhanced Frontend + Backend Schema Extension  
**Next Step:** Invoke planning or implementation skill to create task breakdown and begin implementation.
