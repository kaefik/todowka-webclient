'use client';

import { useState } from 'react';
import { useInbox } from '@/lib/hooks/useInbox';
import { useTasks, useUpdateTask } from '@/lib/hooks/useTasks';
import { useProjects } from '@/lib/hooks/useProjects';
import { TaskList } from '@/components/task/TaskList';
import { ProjectList } from '@/components/project/ProjectList';
import { Button } from '@/components/ui/Button';
import type { TaskUpdate } from '@/types';

type ReviewStep = 'inbox' | 'projects' | 'next-actions' | 'someday';

export default function ReviewPage() {
  const [step, setStep] = useState<ReviewStep>('inbox');
  const { data: inboxTasks } = useInbox();
  const { data: somedayTasks } = useTasks({ status: 'someday' });
  const { data: projects } = useProjects(1, 50);
  const updateTask = useUpdateTask();

  const steps = [
    { id: 'inbox' as ReviewStep, label: 'Inbox Review', icon: '📥' },
    { id: 'projects' as ReviewStep, label: 'Projects Review', icon: '📁' },
    { id: 'next-actions' as ReviewStep, label: 'Next Actions', icon: '⚡' },
    { id: 'someday' as ReviewStep, label: 'Someday Review', icon: '🔮' },
  ];

  const handleSetActive = (task: any) => {
    updateTask.mutate({ id: task.id, data: { status: 'active' } });
  };

  const handleSetNextAction = (task: any) => {
    updateTask.mutate({ id: task.id, data: { is_next_action: true } as any });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Weekly Review</h1>

      <div className="flex gap-2 flex-wrap">
        {steps.map((s) => (
          <Button
            key={s.id}
            variant={step === s.id ? 'primary' : 'ghost'}
            onClick={() => setStep(s.id)}
          >
            {s.icon} {s.label}
          </Button>
        ))}
      </div>

      {step === 'inbox' && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Inbox Review</h2>
          <p className="mb-4 text-foreground-secondary">
            Process all items in your inbox. Clarify, organize, or delete them.
          </p>
          <TaskList tasks={inboxTasks || []} />
        </section>
      )}

      {step === 'projects' && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Projects Review</h2>
          <p className="mb-4 text-foreground-secondary">
            Review your projects, update status, and check progress.
          </p>
          <ProjectList projects={projects?.items || []} />
        </section>
      )}

      {step === 'next-actions' && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Next Actions Selection</h2>
          <p className="mb-4 text-foreground-secondary">
            Select tasks for next week by marking them as Next Actions.
          </p>
          <TaskList
            tasks={inboxTasks || []}
            onNextAction={(id) => handleSetNextAction({ id })}
          />
        </section>
      )}

      {step === 'someday' && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Someday Review</h2>
          <p className="mb-4 text-foreground-secondary">
            Review tasks without deadlines. Decide if any should become active.
          </p>
          <TaskList
            tasks={somedayTasks || []}
            onNextAction={(id) => handleSetActive({ id })}
          />
        </section>
      )}
    </div>
  );
}
