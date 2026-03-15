'use client';

import { Checkbox } from '@/components/ui/Checkbox';
import { DateTimePicker } from '@/components/ui/DateTimePicker';

interface ReminderSettingsProps {
  reminderTime: string | null;
  reminderEnabled: boolean;
  timezone: string;
  onReminderTimeChange: (time: string | null) => void;
  onReminderEnabledChange: (enabled: boolean) => void;
}

export function ReminderSettings({ 
  reminderTime, 
  reminderEnabled, 
  timezone, 
  onReminderTimeChange, 
  onReminderEnabledChange 
}: ReminderSettingsProps) {
  return (
    <div className="space-y-3 border rounded-lg p-4">
      <div className="flex items-center gap-2">
        <Checkbox
          label="Enable reminder"
          checked={reminderEnabled}
          onChange={onReminderEnabledChange}
        />
      </div>
      
      {reminderEnabled && (
        <DateTimePicker
          value={reminderTime}
          onChange={onReminderTimeChange}
          timezone={timezone}
          label="Reminder time"
          placeholder="Set reminder time"
        />
      )}
    </div>
  );
}
