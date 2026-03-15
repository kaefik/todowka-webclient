import { calculateNextDueDate, calculateNextReminderTime } from '../recurrenceCalculator';

describe('RecurrenceCalculator', () => {
  describe('calculateNextDueDate', () => {
    describe('daily recurrence', () => {
      test('daily recurrence adds 1 day', () => {
        const result = calculateNextDueDate({
          recurrenceType: 'daily',
          recurrenceConfig: {},
          currentDueDate: new Date('2026-03-15'),
          timezone: 'UTC'
        });
        expect(result).toEqual(new Date('2026-03-16'));
      });
    });

    describe('weekly recurrence', () => {
      test('weekly recurrence with selected days finds next day', () => {
        const result = calculateNextDueDate({
          recurrenceType: 'weekly',
          recurrenceConfig: { days_of_week: [1, 3, 5] },
          currentDueDate: new Date('2026-03-16'),
          timezone: 'UTC'
        });
        expect(result).toEqual(new Date('2026-03-18'));
      });

      test('weekly recurrence wraps to next week', () => {
        const result = calculateNextDueDate({
          recurrenceType: 'weekly',
          recurrenceConfig: { days_of_week: [1, 3] },
          currentDueDate: new Date('2026-03-17'),
          timezone: 'UTC'
        });
        expect(result).toEqual(new Date('2026-03-18'));
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
    });

    describe('monthly recurrence', () => {
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
        expect(result).toEqual(new Date('2026-02-28'));
      });

      test('monthly recurrence leap year Feb 28 to Feb 29', () => {
        const result = calculateNextDueDate({
          recurrenceType: 'monthly',
          recurrenceConfig: { day_of_month: 28 },
          currentDueDate: new Date('2024-01-28'),
          timezone: 'UTC'
        });
        expect(result).toEqual(new Date('2024-02-28'));
      });
    });

    describe('yearly recurrence', () => {
      test('yearly recurrence adds 1 year', () => {
        const result = calculateNextDueDate({
          recurrenceType: 'yearly',
          recurrenceConfig: {},
          currentDueDate: new Date('2026-03-15'),
          timezone: 'UTC'
        });
        expect(result).toEqual(new Date('2027-03-15'));
      });
    });

    describe('edge cases', () => {
      test('handles leap year', () => {
        const result = calculateNextDueDate({
          recurrenceType: 'yearly',
          recurrenceConfig: {},
          currentDueDate: new Date('2024-02-29'),
          timezone: 'UTC'
        });
        expect(result).toEqual(new Date('2025-03-01'));
      });

      test('returns null for none recurrence type', () => {
        const result = calculateNextDueDate({
          recurrenceType: 'none',
          recurrenceConfig: {},
          currentDueDate: new Date('2026-03-15'),
          timezone: 'UTC'
        });
        expect(result).toBeNull();
      });

      test('returns null for null recurrence type', () => {
        const result = calculateNextDueDate({
          recurrenceType: null,
          recurrenceConfig: {},
          currentDueDate: new Date('2026-03-15'),
          timezone: 'UTC'
        });
        expect(result).toBeNull();
      });
    });
  });

  describe('calculateNextReminderTime', () => {
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

    test('handles negative offset (reminder after due date)', () => {
      const currentReminderTime = new Date('2026-03-15T18:00:00Z');
      const nextDueDate = new Date('2026-03-16T14:00:00Z');
      const currentDueDate = new Date('2026-03-15T14:00:00Z');

      const result = calculateNextReminderTime(
        currentReminderTime,
        nextDueDate,
        currentDueDate
      );

      expect(result).toEqual(new Date('2026-03-16T18:00:00Z'));
    });

    test('handles zero offset (reminder at due time)', () => {
      const currentReminderTime = new Date('2026-03-15T14:00:00Z');
      const nextDueDate = new Date('2026-03-16T14:00:00Z');
      const currentDueDate = new Date('2026-03-15T14:00:00Z');

      const result = calculateNextReminderTime(
        currentReminderTime,
        nextDueDate,
        currentDueDate
      );

      expect(result).toEqual(new Date('2026-03-16T14:00:00Z'));
    });
  });
});
