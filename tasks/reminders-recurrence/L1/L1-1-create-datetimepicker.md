# [L1-1] Create DateTimePicker

## Status
[ ] Pending

## Goal
Build reusable date and time picker component.

## Input
- Extended types from L0-1
- Existing `src/components/ui/Input` component

## Output
`src/components/ui/DateTimePicker.tsx` with DateTimePicker component.

## Done when
- Component renders date and time inputs
- Inputs combine to ISO 8601 format
- Timezone label is displayed
- Component properly handles value changes
- Component is properly typed

## Implementation Details

### File Structure

```tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';

interface DateTimePickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  timezone: string;
  label?: string;
  placeholder?: string;
}

export function DateTimePicker({ 
  value, 
  onChange, 
  timezone, 
  label, 
  placeholder = 'Select date and time' 
}: DateTimePickerProps) {
  // Implementation
}
```

### Component State

Use separate state for date and time inputs:

```tsx
const [dateInput, setDateInput] = useState(value ? value.slice(0, 10) : '');
const [timeInput, setTimeInput] = useState(value ? value.slice(11, 16) : '');
```

### Date Input Handler

When date changes:
1. Update `dateInput` state
2. If `timeInput` is set, call `onChange` with combined value

```tsx
const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newDate = e.target.value;
  setDateInput(newDate);
  if (newDate && timeInput) {
    onChange(`${newDate}T${timeInput}:00Z`);
  }
};
```

### Time Input Handler

When time changes:
1. Update `timeInput` state
2. If `dateInput` is set, call `onChange` with combined value

```tsx
const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newTime = e.target.value;
  setTimeInput(newTime);
  if (dateInput && newTime) {
    onChange(`${dateInput}T${newTime}:00Z`);
  }
};
```

### Render Structure

```tsx
<div className="space-y-2">
  {label && <label className="block text-sm font-medium">{label}</label>}
  <div className="flex gap-2">
    <Input type="date" value={dateInput} onChange={handleDateChange} className="flex-1" />
    <Input type="time" value={timeInput} onChange={handleTimeChange} className="w-32" />
  </div>
  <p className="text-xs text-slate-500">Timezone: {timezone}</p>
</div>
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
