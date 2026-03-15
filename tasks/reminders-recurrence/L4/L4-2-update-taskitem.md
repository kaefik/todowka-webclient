# [L4-2] Update TaskItem

## Status
[ ] Pending

## Goal
Display reminder and recurrence info in task list.

## Input
- Extended types from L0-1

## Output
Updated `src/components/task/TaskItem.tsx` with reminder/recurrence display.

## Done when
- TaskItem shows reminder icon and time
- TaskItem shows recurrence icon and type
- TaskItem shows due date
- All displays use proper styling
- Component compiles without errors

## Implementation Details

### Add Metadata Display Section

Add this section to display task metadata with icons:

```tsx
<div className="flex items-center gap-2 text-xs text-slate-500">
  {/* Reminder */}
  {task.reminder_enabled && task.reminder_time && (
    <span>🔔 {new Date(task.reminder_time).toLocaleString()}</span>
  )}

  {/* Recurrence */}
  {task.recurrence_type && task.recurrence_type !== 'none' && (
    <span>🔄 {task.recurrence_type}</span>
  )}

  {/* Due Date */}
  {task.due_date && (
    <span>📅 {new Date(task.due_date).toLocaleDateString()}</span>
  )}
</div>
```

### Placement

Place this section after the task title and description, but before any action buttons.

### Styling

- `text-xs`: Small font size
- `text-slate-500`: Muted color
- `flex items-center gap-2`: Horizontal layout with spacing
- Icons: 🔔 for reminder, 🔄 for recurrence, 📅 for due date

### Date Formatting

- Use `toLocaleString()` for reminder_time (includes date and time)
- Use `toLocaleDateString()` for due_date (date only)

## Validation

Run these commands after implementation:

```bash
npm run typecheck
npm run lint
```

## Dependencies
- L0-1: Extended types

## Estimated Time
1 hour
