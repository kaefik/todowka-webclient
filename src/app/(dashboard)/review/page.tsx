'use client';

import { useState } from 'react';
import { useInbox } from '@/lib/hooks/useInbox';
import { useTasks, useUpdateTask, useDeleteTask, useCompleteTask, useSetNextAction, useNextActions, useSetWaiting } from '@/lib/hooks/useTasks';
import { useProjects } from '@/lib/hooks/useProjects';
import { TaskList } from '@/components/task/TaskList';
import { ProjectList } from '@/components/project/ProjectList';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/task/TaskForm';
import { WaitingModal } from '@/components/task/WaitingModal';
import { useRouter } from 'next/navigation';
import { useContexts } from '@/lib/hooks/useContexts';
import { useTags } from '@/lib/hooks/useTags';
import type { TaskUpdate, Task, Project } from '@/types';

type ReviewStep = 'inbox' | 'projects' | 'next-actions' | 'someday';

export default function ReviewPage() {
  const router = useRouter();
  const [step, setStep] = useState<ReviewStep>('inbox');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [waitingTask, setWaitingTask] = useState<Task | null>(null);
  const { data: inboxTasks, isLoading: inboxLoading } = useInbox();
  const inboxTasksList = Array.isArray(inboxTasks) ? inboxTasks : (inboxTasks as any)?.items || [];
  const activeInboxTasks = inboxTasksList.filter((t: Task) => !t.completed);
  const { data: nextActions, isLoading: nextActionsLoading } = useNextActions();
  const { data: somedayTasks, isLoading: somedayLoading } = useTasks({ status: 'someday' });
  const somedayTasksList = Array.isArray(somedayTasks) ? somedayTasks : (somedayTasks as any)?.items || [];
  const activeSomedayTasks = somedayTasksList.filter((t: Task) => !t.completed);
  const { data: projects, isLoading: projectsLoading } = useProjects(1, 50);
  const { data: contexts } = useContexts();
  const { data: tags } = useTags();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const completeTask = useCompleteTask();
  const setNextAction = useSetNextAction();
  const setWaiting = useSetWaiting();

  const steps = [
    { id: 'inbox' as ReviewStep, label: 'Inbox Review', icon: '📥' },
    { id: 'projects' as ReviewStep, label: 'Projects Review', icon: '📁' },
    { id: 'next-actions' as ReviewStep, label: 'Next Actions', icon: '⚡' },
    { id: 'someday' as ReviewStep, label: 'Someday Review', icon: '🔮' },
  ];

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleDeleteTask = (id: number) => {
    if (confirm('Delete this task?')) {
      deleteTask.mutate(id);
    }
  };

  const handleSaveTask = (data: TaskUpdate) => {
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, data });
      setEditingTask(null);
    }
  };

  const handleSetActive = (task: any) => {
    const flag = !task.is_next_action;
    if (flag && (task.status === 'waiting' || task.status === 'someday' || task.status === 'completed')) {
      const statusMessage = task.status === 'waiting' ? 'Waiting' :
                          task.status === 'someday' ? 'Someday' : 'Completed';
      if (confirm(`Task is in ${statusMessage} status. Setting as Next Action will change status to Active. Continue?`)) {
        updateTask.mutate({ id: task.id, data: { status: 'active' } }, {
          onSuccess: () => {
            setNextAction.mutate({ id: task.id, flag });
          }
        });
      }
    } else {
      setNextAction.mutate({ id: task.id, flag });
    }
  };

  const handleSetNextAction = (task: any) => {
    const flag = !task.is_next_action;
    if (flag && (task.status === 'waiting' || task.status === 'someday' || task.status === 'completed')) {
      const statusMessage = task.status === 'waiting' ? 'Waiting' :
                          task.status === 'someday' ? 'Someday' : 'Completed';
      if (confirm(`Task is in ${statusMessage} status. Setting as Next Action will change status to Active. Continue?`)) {
        updateTask.mutate({ id: task.id, data: { status: 'active' } }, {
          onSuccess: () => {
            setNextAction.mutate({ id: task.id, flag });
          }
        });
      }
    } else {
      setNextAction.mutate({ id: task.id, flag });
    }
  };

  const handleWaiting = (task: Task) => {
    setWaitingTask(task);
  };

  const handleSetWaiting = (id: number, waitingFor: string) => {
    setWaiting.mutate({ id, waitingFor });
  };

  const handleProjectClick = (project: Project) => {
    router.push(`/projects/${project.id}`);
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
          <TaskList
            tasks={activeInboxTasks}
            loading={inboxLoading}
            showNextButton={false}
            showWaitingButton={true}
            onComplete={(id) => completeTask.mutate(id)}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onWaiting={handleWaiting}
          />
        </section>
      )}

      {step === 'projects' && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Projects Review</h2>
          <p className="mb-4 text-foreground-secondary">
            Review your projects, update status, and check progress.
          </p>
          <ProjectList
            projects={projects?.items || []}
            loading={projectsLoading}
            onProjectClick={handleProjectClick}
          />
        </section>
      )}

      {step === 'next-actions' && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Next Actions Selection</h2>
          <p className="mb-4 text-foreground-secondary">
            Select tasks for next week by marking them as Next Actions.
          </p>
          <TaskList
            tasks={nextActions || []}
            loading={nextActionsLoading}
            showNextButton={true}
            showWaitingButton={true}
            onComplete={(id) => completeTask.mutate(id)}
            onNextAction={(id) => {
              const task = (nextActions || []).find((t: any) => t.id === id);
              if (task) {
                handleSetNextAction(task);
              }
            }}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onWaiting={handleWaiting}
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
            tasks={activeSomedayTasks}
            loading={somedayLoading}
            showNextButton={true}
            showWaitingButton={true}
            onComplete={(id) => completeTask.mutate(id)}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onNextAction={(id) => {
              const task = (somedayTasks || []).find((t: any) => t.id === id);
              if (task) {
                handleSetActive(task);
              }
            }}
            onWaiting={handleWaiting}
          />
        </section>
      )}

      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task">
        {editingTask && (
          <TaskForm
            task={editingTask}
            projects={projects?.items || []}
            contexts={contexts || []}
            tags={tags || []}
            onSubmit={handleSaveTask}
            onCancel={() => setEditingTask(null)}
            isSubmitting={updateTask.isPending}
          />
        )}
      </Modal>

      <WaitingModal
        isOpen={!!waitingTask}
        onClose={() => setWaitingTask(null)}
        task={waitingTask}
        onSubmit={handleSetWaiting}
        isSubmitting={setWaiting.isPending}
      />
    </div>
  );
}
