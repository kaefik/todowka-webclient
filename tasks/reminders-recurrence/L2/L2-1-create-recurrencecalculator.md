# [L2-1] Create RecurrenceCalculator

## Status
[ ] Pending

## Goal
Implement date calculation logic for task recurrence.

## Input
- Extended types from L0-1
- date-fns library (already installed)

## Output
`src/lib/utils/recurrenceCalculator.ts` with:
- `calculateNextDueDate` function
- `calculateWeeklyNextDate` function (internal)
- `calculateMonthlyNextDate` function (internal)
- `calculateNextReminderTime` function

## Done when
- All recurrence types calculate correct next dates
- Edge cases are handled (month end, leap year, weekly wrap-around)
- TypeScript types are correct
- All functions have proper exports

## Implementation Details

### File Structure

```typescript
import type { RecurrenceType, RecurrenceConfig } from '@/types';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

interface CalculateNextDateParams {
  recurrenceType: RecurrenceType;
  recurrenceConfig: RecurrenceConfig;
  currentDueDate: Date;
  timezone: string;
}

export function calculateNextDueDate(params: CalculateNextDateParams): Date | null {
  // Implementation
}

function calculateWeeklyNextDate(baseDate: Date, config: RecurrenceConfig): Date {
  // Implementation
}

function calculateMonthlyNextDate(baseDate: Date, config: RecurrenceConfig): Date {
  // Implementation
}

export function calculateNextReminderTime(
  currentReminderTime: Date,
  nextDueDate: Date,
  currentDueDate: Date
): Date | null {
  // Implementation
}
```

### calculateNextDueDate

Handle each recurrence type:
- `none` or `null`: return `null`
- `daily`: add 1 day
- `weekly`: call `calculateWeeklyNextDate`
- `monthly`: call `calculateMonthlyNextDate`
- `yearly`: add 1 year

### calculateWeeklyNextDate

Logic:
1. If `days_of_week` is empty, add 1 week
2. Sort days of week numerically
3. Find next day of week after current day
4. If found, add that many days
5. If not found (no more days this week), wrap to first day next week

### calculateMonthlyNextDate

Logic:
1. Use `day_of_month` from config, or current day of month
2. Add 1 month
3. Clamp to valid day for that month (e.g., Jan 31 → Feb 28/29)

### calculateNextReminderTime

Calculate the time difference between current due date and current reminder time, then apply that same offset to the next due date.

### Edge Cases

- January 31 → February 28/29
- February 29 leap year handling
- Weekly wrap-around (e.g., Friday → Monday next week)
- No days selected in weekly recurrence

## Validation

Run these commands after implementation:

```bash
npm run typecheck
npm run lint
```

## Dependencies
- L0-1: Extended types

## Estimated Time
2 hours
