# [L1-4] Create RecurrenceSettings

## Status
[ ] Pending

## Goal
Build component for configuring task recurrence.

## Input
- Extended types from L0-1
- Existing Select and Checkbox components

## Output
`src/components/task/RecurrenceSettings.tsx` with RecurrenceSettings component.

## Done when
- Component shows recurrence type selector
- Weekly recurrence shows day checkboxes
- Monthly recurrence shows day of month selector
- Days of week can be selected/deselected
- Day of month can be changed
- Callback props are properly called
- Component is properly typed

## Implementation Details

### File Structure

```tsx
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
  // Implementation
}
```

### Days of Week Handler

```tsx
const handleDaysOfWeekChange = (day: number, checked: boolean) => {
  const currentDays = recurrenceConfig?.days_of_week || [];
  const newDays = checked 
    ? [...currentDays, day]
    : currentDays.filter(d => d !== day);
  onConfigChange({ ...recurrenceConfig, days_of_week: newDays });
};
```

### Day of Month Handler

```tsx
const handleDayOfMonthChange = (day: string) => {
  const dayNum = parseInt(day);
  onConfigChange({ 
    ...recurrenceConfig, 
    day_of_month: isNaN(dayNum) ? undefined : dayNum 
  });
};
```

### Component Render

```tsx
return (
  <div className="space-y-3 border rounded-lg p-4">
    {/* Recurrence Type Selector */}
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

    {/* Weekly Days */}
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

    {/* Monthly Day */}
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
2 hours
