'use client';

import { useEffect, useRef } from 'react';
import { useTasks } from '@/lib/hooks/useTasks';
import { notificationService } from '@/lib/services/NotificationService';
import type { Task } from '@/types';

export function NotificationManager() {
  const { data: tasks } = useTasks();
  const intervalRef = useRef<NodeJS.Timeout>();
  const checkedTasks = useRef<Set<number>>(new Set());

  useEffect(() => {
    notificationService.init();
  }, []);

  const checkReminders = () => {
    const now = Date.now();
    const checkWindow = 300000; // 5 minutes window

    if (!tasks) return;

    const tasksArray = Array.isArray(tasks) ? tasks : (tasks as any).items || [];

    console.log('[NotificationManager] Checking reminders for', tasksArray.length, 'tasks at', new Date().toISOString());
    console.log('[NotificationManager] Current time:', new Date(now).toISOString());
    
    let remindersShown = 0;
    tasksArray.forEach((task: Task) => {
      const reminderEnabled = task.reminder_enabled === true;
      
      console.log('[NotificationManager] Checking task:', task.title, {
        reminder_enabled: task.reminder_enabled,
        reminder_time: task.reminder_time,
        completed: task.completed,
        id: task.id,
        checkedBefore: checkedTasks.current.has(task.id),
        reminderEnabledCalculated: reminderEnabled
      });

      if (!reminderEnabled || !task.reminder_time || task.completed) {
        console.log('[NotificationManager] Skipping task (condition failed)');
        return;
      }

      const reminderTime = new Date(task.reminder_time).getTime();
      const timeDiff = reminderTime - now;

      console.log('[NotificationManager] Time diff for', task.title, ':', timeDiff, 'ms', '(' + (timeDiff / 1000 / 60) + ' minutes)');

      if (timeDiff <= 0 && timeDiff > -checkWindow && !checkedTasks.current.has(task.id)) {
        console.log('[NotificationManager] ✅ Showing reminder for:', task.title);
        notificationService.showReminder(task.title, task.due_date || task.reminder_time);
        checkedTasks.current.add(task.id);
        remindersShown++;
      } else {
        console.log('[NotificationManager] ⏰ Not showing reminder - out of window or already shown');
      }
    });

    if (remindersShown > 0) {
      console.log('[NotificationManager] 🎉 Showed', remindersShown, 'reminder(s)');
    } else {
      console.log('[NotificationManager] ⏸️  No reminders shown in this check');
    }
  };

  useEffect(() => {
    if (!tasks) return;

    checkReminders();
    intervalRef.current = setInterval(checkReminders, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [tasks]);

  return null;
}
