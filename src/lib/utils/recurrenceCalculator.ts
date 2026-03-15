import type { RecurrenceType, RecurrenceConfig } from '@/types';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

interface CalculateNextDateParams {
  recurrenceType: RecurrenceType;
  recurrenceConfig: RecurrenceConfig;
  currentDueDate: Date;
  timezone: string;
}

export function calculateNextDueDate(params: CalculateNextDateParams): Date | null {
  const { recurrenceType, recurrenceConfig, currentDueDate } = params;

  if (!recurrenceType || recurrenceType === 'none') {
    return null;
  }

  switch (recurrenceType) {
    case 'daily':
      return addDays(currentDueDate, 1);
    case 'weekly':
      return calculateWeeklyNextDate(currentDueDate, recurrenceConfig);
    case 'monthly':
      return calculateMonthlyNextDate(currentDueDate, recurrenceConfig);
    case 'yearly':
      return addYears(currentDueDate, 1);
    default:
      return null;
  }
}

function calculateWeeklyNextDate(baseDate: Date, config: RecurrenceConfig): Date {
  const daysOfWeek = config.days_of_week;

  if (!daysOfWeek || daysOfWeek.length === 0) {
    return addWeeks(baseDate, 1);
  }

  const currentDayOfWeek = baseDate.getDay();
  const sortedDays = [...daysOfWeek].sort((a, b) => a - b);
  
  const upcomingDay = sortedDays.find(day => day > currentDayOfWeek);
  
  if (upcomingDay !== undefined) {
    const daysToAdd = upcomingDay - currentDayOfWeek;
    return addDays(baseDate, daysToAdd);
  } else {
    const firstDayNextWeek = sortedDays[0];
    const daysUntilFirstNextWeek = (7 - currentDayOfWeek) + firstDayNextWeek;
    return addDays(baseDate, daysUntilFirstNextWeek);
  }
}

function calculateMonthlyNextDate(baseDate: Date, config: RecurrenceConfig): Date {
  const dayOfMonth = config.day_of_month ?? baseDate.getDate();
  const nextMonth = addMonths(baseDate, 1);
  
  const maxDayInMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
  const clampedDay = Math.min(dayOfMonth, maxDayInMonth);
  
  return new Date(nextMonth.getFullYear(), nextMonth.getMonth(), clampedDay);
}

export function calculateNextReminderTime(
  currentReminderTime: Date,
  nextDueDate: Date,
  currentDueDate: Date
): Date | null {
  const currentReminderOffset = currentReminderTime.getTime() - currentDueDate.getTime();
  const nextReminderTime = new Date(nextDueDate.getTime() + currentReminderOffset);
  
  return nextReminderTime;
}
