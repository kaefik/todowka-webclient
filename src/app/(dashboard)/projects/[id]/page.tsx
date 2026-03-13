'use client';

import { useParams } from 'next/navigation';
import { useProject } from '@/lib/hooks/useProjects';
import { useTasks, useCreateTask, useCompleteTask } from '@/lib/hooks/useTasks';
import { ProjectCard } from '@/components/project/ProjectCard';
import { TaskList } from '@/components/task/TaskList';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/task/TaskForm';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import type { TaskCreate } from '@/types';
import { useContexts } from '@/lib/hooks/useContexts';
import { useTags } from '@/lib/hooks/useTags';

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const { data: project } = useProject(projectId);
  const { data: projectTasks, isLoading } = useTasks({ project_id: projectId });
  const { data: contexts } = useContexts();
  const { data: tags } = useTags();

  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const createTask = useCreateTask();
  const completeTask = useCompleteTask();

  return (
    <div className="space-y-6">
      {project && (
        <ProjectCard project={project} />
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button variant="primary" onClick={() => setIsCreatingTask(true)}>
          + Add Task
        </Button>
      </div>

      <TaskList
        tasks={projectTasks || []}
        loading={isLoading}
        onComplete={(id) => completeTask.mutate(id)}
      />

      <Modal isOpen={isCreatingTask} onClose={() => setIsCreatingTask(false)} title="Add Task">
        <TaskForm
          projects={project ? [project] : []}
          contexts={contexts || []}
          tags={tags || []}
          onSubmit={(data: TaskCreate | any) => {
            createTask.mutate({ ...data, project_id: projectId });
            setIsCreatingTask(false);
          }}
          onCancel={() => setIsCreatingTask(false)}
          isSubmitting={createTask.isPending}
        />
      </Modal>
    </div>
  );
}
