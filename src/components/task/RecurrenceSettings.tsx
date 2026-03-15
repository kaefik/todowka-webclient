'use client';

import { Select, SelectItem } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import type { RecurrenceType, RecurrenceConfig } from '@/types';

const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 0, label: 'Sunday' },
];

interface RecurrenceSettingsProps {
  recurrenceType: RecurrenceType | null;
  recurrenceConfig: RecurrenceConfig | null;
  onTypeChange: (type: RecurrenceType | null) => void;
  onConfigChange: (config: RecurrenceConfig | null) => void;
}

export function RecurrenceSettings({ 
  recurrenceType, 
  recurrenceConfig, 
  onTypeChange, 
  onConfigChange 
}: RecurrenceSettingsProps) {
  const handleDaysOfWeekChange = (day: number, checked: boolean) => {
    const currentDays = recurrenceConfig?.days_of_week || [];
    const newDays = checked 
      ? [...currentDays, day]
      : currentDays.filter(d => d !== day);
    onConfigChange({ ...recurrenceConfig, days_of_week: newDays });
  };

  const handleDayOfMonthChange = (day: string) => {
    const dayNum = parseInt(day);
    onConfigChange({ 
      ...recurrenceConfig, 
      day_of_month: isNaN(dayNum) ? undefined : dayNum 
    });
  };

  return (
    <div className="space-y-3 border rounded-lg p-4">
      <div>
        <label className="block text-sm font-medium mb-1">Repeat</label>
        <Select
          value={recurrenceType || ''}
          onChange={(value) => onTypeChange(value === '' ? null : value as RecurrenceType)}
        >
          <SelectItem value="">No repeat</SelectItem>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="yearly">Yearly</SelectItem>
        </Select>
      </div>

      {recurrenceType === 'weekly' && (
        <div>
          <label className="block text-sm font-medium mb-2">Repeat on</label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map(day => (
              <Checkbox
                key={day.value}
                label={day.label}
                checked={recurrenceConfig?.days_of_week?.includes(day.value) || false}
                onChange={(checked) => handleDaysOfWeekChange(day.value, checked)}
              />
            ))}
          </div>
        </div>
      )}

      {recurrenceType === 'monthly' && (
        <div>
          <label className="block text-sm font-medium mb-1">Day of month</label>
          <Select
            value={recurrenceConfig?.day_of_month?.toString() || ''}
            onChange={handleDayOfMonthChange}
          >
            <SelectItem value="">Select day</SelectItem>
            {Array.from({ length: 31 }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
}
