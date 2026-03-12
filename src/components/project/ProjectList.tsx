import type { Project } from '@/types';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from '@/components/ui/EmptyState';

interface ProjectListProps {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (id: number) => void;
  onComplete?: (id: number) => void;
}

export function ProjectList({ projects, onEdit, onDelete, onComplete }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects found"
        description="Create a new project to organize your tasks"
        icon="📁"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          onComplete={onComplete}
        />
      ))}
    </div>
  );
}
