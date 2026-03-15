# [L5-1] Test RecurrenceCalculator

## Status
[ ] Pending

## Goal
Unit tests for date calculation logic.

## Input
- RecurrenceCalculator from L2-1

## Output
Test file for RecurrenceCalculator with comprehensive test cases.

## Done when
- All recurrence types have test cases
- Edge cases are tested
- All tests pass

## Test Cases

### Daily Recurrence

```typescript
test('daily recurrence adds 1 day', () => {
  const result = calculateNextDueDate({
    recurrenceType: 'daily',
    recurrenceConfig: {},
    currentDueDate: new Date('2026-03-15'),
    timezone: 'UTC'
  });
  expect(result).toEqual(new Date('2026-03-16'));
});
```

### Weekly Recurrence

```typescript
test('weekly recurrence with selected days finds next day', () => {
  const result = calculateNextDueDate({
    recurrenceType: 'weekly',
    recurrenceConfig: { days_of_week: [1, 3, 5] }, // Mon, Wed, Fri
    currentDueDate: new Date('2026-03-16'), // Monday
    timezone: 'UTC'
  });
  expect(result).toEqual(new Date('2026-03-18')); // Wednesday
});

test('weekly recurrence wraps to next week', () => {
  const result = calculateNextDueDate({
    recurrenceType: 'weekly',
    recurrenceConfig: { days_of_week: [1, 3] }, // Mon, Wed
    currentDueDate: new Date('2026-03-17'), // Tuesday
    timezone: 'UTC'
  });
  expect(result).toEqual(new Date('2026-03-18')); // Wednesday same week
});

test('weekly recurrence no days selected adds 1 week', () => {
  const result = calculateNextDueDate({
    recurrenceType: 'weekly',
    recurrenceConfig: {},
    currentDueDate: new Date('2026-03-15'),
    timezone: 'UTC'
  });
  expect(result).toEqual(new Date('2026-03-22'));
});
```

### Monthly Recurrence

```typescript
test('monthly recurrence same day next month', () => {
  const result = calculateNextDueDate({
    recurrenceType: 'monthly',
    recurrenceConfig: { day_of_month: 15 },
    currentDueDate: new Date('2026-03-15'),
    timezone: 'UTC'
  });
  expect(result).toEqual(new Date('2026-04-15'));
});

test('monthly recurrence handles month end', () => {
  const result = calculateNextDueDate({
    recurrenceType: 'monthly',
    recurrenceConfig: { day_of_month: 31 },
    currentDueDate: new Date('2026-01-31'),
    timezone: 'UTC'
  });
  expect(result).toEqual(new Date('2026-02-28')); // February
});
```

### Yearly Recurrence

```typescript
test('yearly recurrence adds 1 year', () => {
  const result = calculateNextDueDate({
    recurrenceType: 'yearly',
    recurrenceConfig: {},
    currentDueDate: new Date('2026-03-15'),
    timezone: 'UTC'
  });
  expect(result).toEqual(new Date('2027-03-15'));
});
```

### Leap Year

```typescript
test('handles leap year', () => {
  const result = calculateNextDueDate({
    recurrenceType: 'yearly',
    recurrenceConfig: {},
    currentDueDate: new Date('2024-02-29'),
    timezone: 'UTC'
  });
  expect(result).toEqual(new Date('2025-03-01')); // 2025 is not leap year
});
```

### calculateNextReminderTime

```typescript
test('maintains reminder offset', () => {
  const currentReminderTime = new Date('2026-03-15T10:00:00Z');
  const nextDueDate = new Date('2026-03-16T14:00:00Z');
  const currentDueDate = new Date('2026-03-15T14:00:00Z');

  const result = calculateNextReminderTime(
    currentReminderTime,
    nextDueDate,
    currentDueDate
  );

  expect(result).toEqual(new Date('2026-03-16T10:00:00Z'));
});
```

## Implementation

Create test file at `src/lib/utils/__tests__/recurrenceCalculator.test.ts`.

Use test framework configured in project (check `package.json` for Jest, Vitest, etc.).

## Validation

Run tests with appropriate command:

```bash
npm test  # or project-specific test command
```

## Dependencies
- L2-1: RecurrenceCalculator

## Estimated Time
2 hours
