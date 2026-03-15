'use client';

import { useState, useEffect } from 'react';
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
  const [dateInput, setDateInput] = useState(value ? value.slice(0, 10) : '');
  const [timeInput, setTimeInput] = useState(value ? value.slice(11, 16) : '');

  useEffect(() => {
    setDateInput(value ? value.slice(0, 10) : '');
    setTimeInput(value ? value.slice(11, 16) : '');
  }, [value]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDateInput(newDate);
    if (newDate && timeInput) {
      onChange(`${newDate}T${timeInput}:00Z`);
    } else if (!newDate) {
      onChange(null);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeInput(newTime);
    if (dateInput && newTime) {
      onChange(`${dateInput}T${newTime}:00Z`);
    } else if (!newTime) {
      onChange(null);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}
      <div className="flex gap-2">
        <Input 
          type="date" 
          value={dateInput} 
          onChange={handleDateChange} 
          className="flex-1" 
          placeholder={placeholder}
        />
        <Input 
          type="time" 
          value={timeInput} 
          onChange={handleTimeChange} 
          className="w-32" 
        />
      </div>
      <p className="text-xs text-slate-500">Timezone: {timezone}</p>
    </div>
  );
}
