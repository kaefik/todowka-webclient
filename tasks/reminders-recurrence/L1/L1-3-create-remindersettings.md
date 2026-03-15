# [L1-3] Create ReminderSettings

## Status
[ ] Pending

## Goal
Build component for configuring task reminders.

## Input
- DateTimePicker from L1-1
- Extended types from L0-1
- Existing Checkbox component

## Output
`src/components/task/ReminderSettings.tsx` with ReminderSettings component.

## Done when
- Component renders enable checkbox
- DateTimePicker shows only when reminder is enabled
- Callback props are properly called on changes
- Component is properly typed

## Implementation Details

### File Structure

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
  // Implementation
}
```

### Component Render

```tsx
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
```

### Key Features

- Border container with padding
- Checkbox for enabling/disabling reminder
- Conditional rendering of DateTimePicker
- Proper TypeScript types

## Validation

Run these commands after implementation:

```bash
npm run typecheck
npm run lint
```

## Dependencies
- L0-1: Extended types
- L1-1: DateTimePicker

## Estimated Time
1 hour
