# [L4-1] Update TaskForm

## Status
[ ] Pending

## Goal
Integrate reminder and recurrence components into task form.

## Input
- DateTimePicker from L1-1
- ReminderSettings from L1-3
- RecurrenceSettings from L1-4
- useSetReminder from L3-2
- useSetRecurrence from L3-3
- Existing TaskForm component

## Output
Updated `src/components/task/TaskForm.tsx` with:
- Extended TaskFormData interface
- Extended taskSchema with validation
- DateTimePicker for due_date
- ReminderSettings component
- RecurrenceSettings component
- Timezone selector
- Updated form submission

## Done when
- Form displays all new components
- Form validation includes new fields
- Form submission includes new fields in data
- Component compiles without errors

## Implementation Details

### Extend TaskFormData Interface

```typescript
interface TaskFormData {
  // ... existing fields ...
  due_date?: string;
  reminder_time?: string;
  reminder_enabled?: boolean;
  recurrence_type?: RecurrenceType | null;
  recurrence_config?: RecurrenceConfig | null;
  timezone?: string;
}
```

### Extend taskSchema

```typescript
const taskSchema = z.object({
  // ... existing fields ...
  due_date: z.string().nullable().optional(),
  reminder_time: z.string().nullable().optional(),
  reminder_enabled: z.boolean().optional(),
  recurrence_type: z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly']).nullable().optional(),
  recurrence_config: z.object({
    days_of_week: z.array(z.number()).optional(),
    day_of_month: z.number().optional(),
  }).nullable().optional(),
  timezone: z.string().optional(),
});
```

### Add New Components to Form

#### DateTimePicker for due_date

```tsx
<DateTimePicker
  value={watch('due_date') || null}
  onChange={(value) => setValue('due_date', value)}
  timezone={watch('timezone') || 'UTC'}
  label="Due date"
/>
```

#### ReminderSettings

```tsx
<ReminderSettings
  reminderTime={watch('reminder_time') || null}
  reminderEnabled={watch('reminder_enabled') || false}
  timezone={watch('timezone') || 'UTC'}
  onReminderTimeChange={(time) => setValue('reminder_time', time)}
  onReminderEnabledChange={(enabled) => setValue('reminder_enabled', enabled)}
/>
```

#### RecurrenceSettings

```tsx
<RecurrenceSettings
  recurrenceType={watch('recurrence_type') || null}
  recurrenceConfig={watch('recurrence_config') || null}
  onTypeChange={(type) => setValue('recurrence_type', type)}
  onConfigChange={(config) => setValue('recurrence_config', config)}
/>
```

#### Timezone Selector

```tsx
<Controller
  name="timezone"
  control={control}
  render={({ field }) => (
    <Select
      value={field.value || 'UTC'}
      onChange={(value) => field.onChange(value)}
    >
      <SelectItem value="UTC">UTC</SelectItem>
      <SelectItem value="Europe/Moscow">Moscow</SelectItem>
      <SelectItem value="America/New_York">New York</SelectItem>
      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
    </Select>
  )}
/>
```

### Update defaultValues

```typescript
defaultValues: {
  // ... existing defaults ...
  due_date: task?.due_date,
  reminder_time: task?.reminder_time,
  reminder_enabled: task?.reminder_enabled || false,
  recurrence_type: task?.recurrence_type,
  recurrence_config: task?.recurrence_config,
  timezone: task?.timezone || 'UTC',
}
```

### Update handleSubmitWithLog

Add new fields to submission data:

```typescript
const submitData: TaskCreate | TaskUpdate = {
  // ... existing fields ...
  due_date: data.due_date,
  reminder_time: data.reminder_time,
  reminder_enabled: data.reminder_enabled,
  recurrence_type: data.recurrence_type,
  recurrence_config: data.recurrence_config,
  timezone: data.timezone,
};
```

## Validation

Run these commands after implementation:

```bash
npm run typecheck
npm run lint
```

## Dependencies
- L0-1: Extended types
- L1-1: DateTimePicker
- L1-3: ReminderSettings
- L1-4: RecurrenceSettings
- L3-2: useSetReminder
- L3-3: useSetRecurrence

## Estimated Time
2 hours
