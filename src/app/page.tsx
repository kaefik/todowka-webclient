'use client';

import { useInbox } from '@/lib/hooks/useInbox';
import { useNextActions, useCompleteTask, useSetNextAction } from '@/lib/hooks/useTasks';
import { useProjects } from '@/lib/hooks/useProjects';
import { QuickCapture } from '@/components/layout/QuickCapture';
import { TaskList } from '@/components/task/TaskList';
import { ProjectList } from '@/components/project/ProjectList';
import { useRouter } from 'next/navigation';
import type { Task, TaskListResponse, Project } from '@/types';

export default function Dashboard() {
  const router = useRouter();
  const { data: inboxTasks, isLoading: inboxLoading } = useInbox();
  const { data: nextActions, isLoading: nextActionsLoading } = useNextActions();
  const { data: projects, isLoading: projectsLoading } = useProjects(1, 10);
  const completeTask = useCompleteTask();
  const setNextAction = useSetNextAction();

  const handleComplete = (id: number) => {
    completeTask.mutate(id);
  };

  const handleNextAction = (id: number) => {
    const task = nextActionsList.find((t: Task) => t.id === id);
    const flag = task ? !task.is_next_action : true;
    setNextAction.mutate({ id, flag });
  };

  const handleProjectClick = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  const handleStatClick = (path: string) => {
    router.push(path);
  };

  const inboxTasksList = Array.isArray(inboxTasks) ? inboxTasks : (inboxTasks as any)?.items || [];
  const inboxCount = inboxTasksList.filter((t: Task) => !t.completed).length;
  const nextActionsList = Array.isArray(nextActions) ? nextActions : (nextActions as any)?.items || [];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <section>
        <QuickCapture />
      </section>

      <section className="grid grid-cols-3 gap-4">
        <div
          className="p-4 bg-white border border-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleStatClick('/inbox')}
        >
          <div className="text-3xl font-bold text-blue-600">
            {inboxCount}
          </div>
          <div className="text-sm text-foreground-secondary">Inbox</div>
        </div>
        <div
          className="p-4 bg-white border border-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleStatClick('/tasks/next-actions')}
        >
          <div className="text-3xl font-bold text-green-600">
            {nextActionsList.length || 0}
          </div>
          <div className="text-sm text-foreground-secondary">Next Actions</div>
        </div>
        <div
          className="p-4 bg-white border border-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleStatClick('/projects')}
        >
          <div className="text-3xl font-bold text-purple-600">
            {projects?.items?.filter(p => p.status === 'active').length || 0}
          </div>
          <div className="text-sm text-foreground-secondary">Active Projects</div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Next Actions</h2>
        <TaskList
          tasks={nextActionsList.slice(0, 5)}
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
          onProjectClick={handleProjectClick}
        />
      </section>
    </div>
  );
}
