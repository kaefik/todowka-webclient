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
    const checkWindow = 60000;

    if (!tasks) return;

    const tasksArray = Array.isArray(tasks) ? tasks : (tasks as any).items || [];

    tasksArray.forEach((task: Task) => {
      if (!task.reminder_enabled || !task.reminder_time || task.completed) return;

      const reminderTime = new Date(task.reminder_time).getTime();
      const timeDiff = reminderTime - now;

      if (timeDiff <= 0 && timeDiff > -checkWindow && !checkedTasks.current.has(task.id)) {
        notificationService.showReminder(task.title, task.due_date || task.reminder_time);
        checkedTasks.current.add(task.id);
      }
    });
  };

  useEffect(() => {
    if (!tasks) return;

    checkReminders();
    intervalRef.current = setInterval(checkReminders, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [tasks]);

  return null;
}
