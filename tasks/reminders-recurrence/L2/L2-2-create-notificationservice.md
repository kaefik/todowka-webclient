# [L2-2] Create NotificationService

## Status
[ ] Pending

## Goal
Implement browser notification management.

## Input
- None (uses browser Notification API)

## Output
`src/lib/services/NotificationService.ts` with NotificationService class and singleton instance.

## Done when
- Service can request notification permission
- Service can check if notifications can show
- Service can display notifications
- Proper error handling for unsupported browsers and denied permissions
- Singleton instance is exported

## Implementation Details

### File Structure

```typescript
class NotificationService {
  private permission: NotificationPermission = 'default';

  async init(): Promise<void> {
    // Check API support and request permission
  }

  canShow(): boolean {
    // Return true if permission is granted
  }

  async requestPermission(): Promise<NotificationPermission> {
    // Explicitly request permission
  }

  show(title: string, options: NotificationOptions = {}): void {
    // Display browser notification
  }

  showReminder(taskTitle: string, dueDate: string): void {
    // Display task reminder with formatted time
  }
}

export const notificationService = new NotificationService();
```

### init()

1. Check if `Notification` is in `window`
2. If not supported, log warning and return
3. Set `this.permission` to `Notification.permission`
4. If permission is `default`, request it

### canShow()

Return `this.permission === 'granted'`

### requestPermission()

Return `await Notification.requestPermission()`

### show()

1. Check if notifications can show
2. If not, log warning and return
3. Create new `Notification` with:
   - `icon: '/favicon.ico'`
   - `badge: '/favicon.ico'`
   - Any provided options

### showReminder()

1. Calculate time until due date
2. Format time string:
   - If less than 1 hour: "in X minutes"
   - Otherwise: "at HH:MM"
3. Call `show()` with:
   - Title: "Task Reminder"
   - Body: `"${taskTitle}" is due ${timeStr}`
   - `tag: 'task-reminder-${taskTitle}'`
   - `requireInteraction: true`

## Error Handling

- Handle `Notification` API not supported
- Handle permission denied
- Handle permission already granted

## Validation

Run these commands after implementation:

```bash
npm run typecheck
npm run lint
```

## Dependencies
None

## Estimated Time
2 hours
