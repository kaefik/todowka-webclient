# [L0-1] Extend TypeScript Types

## Status
[ ] Pending

## Goal
Add recurrence and reminder types to type definitions.

## Input
- Existing `src/types/index.ts` with Task, TaskCreate, TaskUpdate interfaces

## Output
Updated `src/types/index.ts` with:
- `RecurrenceType` type
- `RecurrenceConfig` interface
- Extended `Task` interface with reminder and recurrence fields
- Extended `TaskCreate` interface with same fields
- Extended `TaskUpdate` interface with same fields

## Done when
- TypeScript compiler accepts changes without errors
- All new fields are properly typed
- No type errors in existing code

## Implementation Details

### Add new type and interface

```typescript
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurrenceConfig {
  days_of_week?: number[];  // [0-6] where 0 = Sunday, or [1-7] where 1 = Monday
  day_of_month?: number;    // 1-31
}
```

### Extend Task interface

Add these fields to `Task` interface:

```typescript
export interface Task {
  // ... existing fields ...
  reminder_enabled: boolean;
  recurrence_type: RecurrenceType | null;
  recurrence_config: RecurrenceConfig | null;
  timezone: string;
}
```

### Extend TaskCreate interface

Add these optional fields to `TaskCreate` interface:

```typescript
export interface TaskCreate {
  // ... existing fields ...
  reminder_enabled?: boolean;
  recurrence_type?: RecurrenceType | null;
  recurrence_config?: RecurrenceConfig | null;
  timezone?: string;
}
```

### Extend TaskUpdate interface

Add these optional fields to `TaskUpdate` interface:

```typescript
export interface TaskUpdate {
  // ... existing fields ...
  reminder_enabled?: boolean;
  recurrence_type?: RecurrenceType | null;
  recurrence_config?: RecurrenceConfig | null;
  timezone?: string;
}
```

## Validation

Run these commands after implementation:

```bash
npm run typecheck
npm run lint
```

## Dependencies
None - this is a foundational task

## Estimated Time
1 hour
