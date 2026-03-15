# [L5-2] Test NotificationService

## Status
[ ] Pending

## Goal
Unit tests for notification service.

## Input
- NotificationService from L2-2

## Output
Test file for NotificationService with comprehensive test cases.

## Done when
- Service initialization is tested
- Permission checking is tested
- Notification display is tested
- Error handling is tested
- All tests pass

## Test Cases

### Init with Notification API Support

```typescript
test('init with Notification API support', async () => {
  const mockNotification = {
    permission: 'granted' as NotificationPermission,
    requestPermission: jest.fn().mockResolvedValue('granted')
  };
  global.Notification = mockNotification as any;

  const service = new NotificationService();
  await service.init();

  expect(mockNotification.requestPermission).toHaveBeenCalled();
});
```

### Init without Notification API

```typescript
test('init without Notification API support', async () => {
  delete (global as any).Notification;

  const service = new NotificationService();
  await service.init();

  // Should not throw error
});
```

### canShow

```typescript
test('canShow returns true when permission granted', () => {
  const service = new NotificationService();
  (service as any).permission = 'granted';

  expect(service.canShow()).toBe(true);
});

test('canShow returns false when permission denied', () => {
  const service = new NotificationService();
  (service as any).permission = 'denied';

  expect(service.canShow()).toBe(false);
});
```

### requestPermission

```typescript
test('requestPermission calls API and returns result', async () => {
  const mockNotification = {
    requestPermission: jest.fn().mockResolvedValue('granted')
  };
  global.Notification = mockNotification as any;

  const service = new NotificationService();
  const result = await service.requestPermission();

  expect(result).toBe('granted');
});
```

### Show

```typescript
test('show displays notification when permitted', () => {
  const mockNotification = jest.fn();
  global.Notification = mockNotification as any;
  (global as any).Notification.permission = 'granted';

  const service = new NotificationService();
  service.show('Test Title', { body: 'Test Body' });

  expect(mockNotification).toHaveBeenCalledWith('Test Title', expect.objectContaining({
    body: 'Test Body'
  }));
});

test('show logs warning when not permitted', () => {
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  global.Notification = undefined as any;

  const service = new NotificationService();
  service.show('Test Title');

  expect(consoleWarnSpy).toHaveBeenCalledWith(
    'Notification permission not granted'
  );
  consoleWarnSpy.mockRestore();
});
```

### showReminder

```typescript
test('showReminder formats time correctly for minutes', () => {
  const mockNotification = jest.fn();
  global.Notification = mockNotification as any;
  (global as any).Notification.permission = 'granted';

  const service = new NotificationService();
  const dueDate = new Date();
  dueDate.setMinutes(dueDate.getMinutes() + 30);

  service.showReminder('Test Task', dueDate.toISOString());

  expect(mockNotification).toHaveBeenCalledWith(
    'Task Reminder',
    expect.objectContaining({
      body: expect.stringContaining('in 30 minutes')
    })
  );
});
```

## Implementation

Create test file at `src/lib/services/__tests__/NotificationService.test.ts`.

Use test framework configured in project (check `package.json` for Jest, Vitest, etc.).

## Mocking

Mock the browser Notification API for tests:

```typescript
const mockNotification = jest.fn();
global.Notification = mockNotification as any;
```

## Validation

Run tests with appropriate command:

```bash
npm test  # or project-specific test command
```

## Dependencies
- L2-2: NotificationService

## Estimated Time
1 hour
