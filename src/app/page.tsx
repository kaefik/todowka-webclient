'use client';

import { useInbox } from '@/lib/hooks/useInbox';
import { useNextActions, useCompleteTask, useSetNextAction } from '@/lib/hooks/useTasks';
import { useProjects } from '@/lib/hooks/useProjects';
import { QuickCapture } from '@/components/layout/QuickCapture';
import { TaskList } from '@/components/task/TaskList';
import { ProjectList } from '@/components/project/ProjectList';
import type { Task } from '@/types';

export default function Dashboard() {
  const { data: inboxTasks, isLoading: inboxLoading } = useInbox();
  const { data: nextActions, isLoading: nextActionsLoading } = useNextActions();
  const { data: projects, isLoading: projectsLoading } = useProjects(1, 10);
  const completeTask = useCompleteTask();
  const setNextAction = useSetNextAction();

  const handleComplete = (id: number) => {
    completeTask.mutate(id);
  };

  const handleNextAction = (id: number) => {
    setNextAction.mutate(id);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <section>
        <QuickCapture />
      </section>

      <section className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-border rounded-lg">
          <div className="text-3xl font-bold text-blue-600">
            {inboxTasks?.length || 0}
          </div>
          <div className="text-sm text-foreground-secondary">Inbox</div>
        </div>
        <div className="p-4 bg-white border border-border rounded-lg">
          <div className="text-3xl font-bold text-green-600">
            {nextActions?.length || 0}
          </div>
          <div className="text-sm text-foreground-secondary">Next Actions</div>
        </div>
        <div className="p-4 bg-white border border-border rounded-lg">
          <div className="text-3xl font-bold text-purple-600">
            {projects?.items?.filter(p => p.status === 'active').length || 0}
          </div>
          <div className="text-sm text-foreground-secondary">Active Projects</div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Next Actions</h2>
        <TaskList
          tasks={nextActions?.slice(0, 5) || []}
          loading={nextActionsLoading}
          onComplete={handleComplete}
          onNextAction={handleNextAction}
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
        <ProjectList
          projects={projects?.items?.filter(p => p.status === 'active') || []}
          loading={projectsLoading}
        />
      </section>
    </div>
  );
}
