# [L3-1] Extend Tasks API Client

## Status
[ ] Pending

## Goal
Add new API methods for reminders and recurrence.

## Input
- Extended types from L0-1
- Existing `src/lib/api/tasks.ts` with tasksAPI

## Output
Updated `src/lib/api/tasks.ts` with:
- `setReminder` method
- `setRecurrence` method
- `setTimezone` method
- `complete` method (updated)

## Done when
- All new methods are defined
- Methods have correct TypeScript signatures
- Methods call correct API endpoints
- Existing methods are preserved

## Implementation Details

### Add to tasksAPI Object

```typescript
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

### API Endpoints

1. **POST /tasks/{id}/reminder**
   - Request: `{ reminder_time: string | null, reminder_enabled: boolean }`
   - Response: `Task`

2. **POST /tasks/{id}/recurrence**
   - Request: `{ recurrence_type: RecurrenceType | null, recurrence_config: RecurrenceConfig | null }`
   - Response: `Task`

3. **POST /tasks/{id}/timezone**
   - Request: `{ timezone: string }`
   - Response: `Task`

4. **POST /tasks/{id}/complete**
   - Request: `{ skip_recurrence: boolean }`
   - Response: `{ task: Task, next_task?: Task }`

### Updated Complete Method

The `complete` method signature changes from:

```typescript
async complete(id: number): Promise<Task>
```

To:

```typescript
async complete(id: number, skipRecurrence = false): Promise<{ task: Task; nextTask?: Task }>
```

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
