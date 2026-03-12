# L8-49 — Create Projects list page (app/projects/page.tsx)

## Goal

Implement projects list with create functionality.

## Input

Task L5-31, L7-39, L5-32 completed.

## Output

`src/app/(dashboard)/projects/page.tsx` with projects page.

## Implementation

```typescript
'use client';

import { useState } from 'react';
import { useProjects } from '@/lib/hooks/useProjects';
import { ProjectList } from '@/components/project/ProjectList';
import { Modal } from '@/components/ui/Modal';
import { ProjectForm } from '@/components/project/ProjectForm';
import { Button } from '@/components/ui/Button';
import { useCreateProject } from '@/lib/hooks/useProjects';
import { useUpdateProject } from '@/lib/hooks/useProjects';
import { useDeleteProject } from '@/lib/hooks/useProjects';
import { useCompleteProject } from '@/lib/hooks/useProjects';
import { useAreas } from '@/lib/hooks/useAreas';
import type { Project } from '@/types';

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const { data: projectsData } = useProjects(page, 10);
  const { data: areas } = useAreas();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const completeProject = useCompleteProject();

  const handleSave = (data: any) => {
    if (editingProject) {
      updateProject.mutate({ id: editingProject.id, data });
      setEditingProject(null);
    } else {
      createProject.mutate(data);
      setIsCreating(false);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this project?')) {
      deleteProject.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button variant="primary" onClick={() => setIsCreating(true)}>
          + New Project
        </Button>
      </div>

      <ProjectList
        projects={projectsData?.items || []}
        onEdit={setEditingProject}
        onDelete={handleDelete}
        onComplete={(id) => completeProject.mutate(id)}
      />

      {/* Create Modal */}
      <Modal isOpen={isCreating} onClose={() => setIsCreating(false)} title="Create Project">
        <ProjectForm
          areas={areas || []}
          onSubmit={handleSave}
          onCancel={() => setIsCreating(false)}
        />
      </Modal>

      {/* Edit Modal */}
      {editingProject && (
        <Modal isOpen={!!editingProject} onClose={() => setEditingProject(null)} title="Edit Project">
          <ProjectForm
            project={editingProject}
            areas={areas || []}
            onSubmit={handleSave}
            onCancel={() => setEditingProject(null)}
          />
        </Modal>
      )}
    </div>
  );
}
```

## Done When

- Displays projects
- Create opens ProjectForm modal
- All actions work

## Effort

L (4 hours)

## Depends On

L5-31, L7-39, L5-32
