# [L5-3] End-to-End Testing

## Status
[ ] Pending

## Goal
Full integration testing of reminder/recurrence flow.

## Input
- All previous tasks completed

## Output
Verified test checklist covering all functionality.

## Done when
- All Frontend tests pass
- All Backend tests pass
- All Integration tests pass
- Edge cases are verified

## Test Checklist

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

#### Daily Recurrence

- [ ] Create task with daily recurrence
- [ ] Complete task
- [ ] Next task appears with due_date +1 day
- [ ] Reminder offset maintained

#### Weekly Recurrence

- [ ] Create task with weekly recurrence (Mon, Wed, Fri)
- [ ] Complete on Monday
- [ ] Next task appears on Wednesday
- [ ] Complete on Wednesday
- [ ] Next task appears on Friday
- [ ] Complete on Friday
- [ ] Next task appears on Monday (next week)

#### Weekly Recurrence Wrap-Around

- [ ] Create task with weekly recurrence (Mon, Wed)
- [ ] Complete on Wednesday
- [ ] Next task appears on Monday (next week)

#### Monthly Recurrence

- [ ] Create task with monthly recurrence (15th)
- [ ] Complete on Jan 15
- [ ] Next task appears on Feb 15

#### Monthly Recurrence - Month End

- [ ] Create task with monthly recurrence (31st)
- [ ] Complete on Jan 31
- [ ] Next task appears on Feb 28 (or 29 in leap year)

#### Yearly Recurrence

- [ ] Create task with yearly recurrence
- [ ] Complete on Mar 15, 2026
- [ ] Next task appears on Mar 15, 2027

#### Leap Year

- [ ] Create task with yearly recurrence (Feb 29)
- [ ] Complete on Feb 29, 2024 (leap year)
- [ ] Next task appears on Mar 1, 2025 (not leap year)

#### Reminder Offset

- [ ] Create task with due_date 14:00, reminder_time 12:00 (2 hours before)
- [ ] Complete task
- [ ] Next task has reminder_time 2 hours before due_date

#### Timezone Handling

- [ ] Create task with timezone Europe/Moscow
- [ ] due_date and reminder_time are in Moscow timezone
- [ ] Recurrence calculates dates correctly with timezone

#### Notifications

- [ ] Browser permission requested on first notification
- [ ] Browser notification appears at reminder_time
- [ ] In-app toast notification appears
- [ ] Each reminder shown only once

#### Skip Recurrence

- [ ] Create recurring task
- [ ] Complete with skip_recurrence=true
- [ ] No next task created
- [ ] Task marked as completed

#### Edit Recurring Task

- [ ] Create task with recurrence
- [ ] Edit task to change recurrence type
- [ ] Changes saved correctly

## Manual Testing Instructions

1. Start development server: `npm run dev`
2. Open browser and navigate to app
3. Create a test task with:
   - Due date: tomorrow
   - Reminder: 1 hour before due
   - Recurrence: daily
4. Verify task appears in list with icons
5. Complete the task
6. Verify next task appears with correct due date
7. Repeat for different recurrence types
8. Test reminder notifications
9. Test edge cases (month end, leap year)

## Automated Testing

If the project has E2E test framework (Playwright, Cypress), create tests for:
- Task creation with recurrence
- Task completion and next task creation
- Notification triggering

## Validation

Run tests with appropriate commands:

```bash
npm test        # Unit tests
npm run test:e2e # E2E tests (if available)
```

## Dependencies
- All previous tasks (L0, L1, L2, L3, L4)

## Estimated Time
4 hours
