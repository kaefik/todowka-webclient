'use client';

import { useState } from 'react';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject, useCompleteProject } from '@/lib/hooks/useProjects';
import { useAreas } from '@/lib/hooks/useAreas';
import { ProjectList } from '@/components/project/ProjectList';
import { Modal } from '@/components/ui/Modal';
import { ProjectForm } from '@/components/project/ProjectForm';
import { Button } from '@/components/ui/Button';
import type { Project, ProjectCreate, ProjectUpdate } from '@/types';

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

  const handleSave = (data: ProjectCreate | ProjectUpdate) => {
    if (editingProject) {
      updateProject.mutate({ id: editingProject.id, data: data as ProjectUpdate });
      setEditingProject(null);
    } else {
      createProject.mutate(data as ProjectCreate);
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

      <Modal isOpen={isCreating} onClose={() => setIsCreating(false)} title="Create Project">
        <ProjectForm
          areas={areas || []}
          onSubmit={handleSave}
          onCancel={() => setIsCreating(false)}
        />
      </Modal>

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
