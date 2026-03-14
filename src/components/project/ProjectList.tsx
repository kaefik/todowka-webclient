import type { Project, ProjectListResponse } from '@/types';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';

interface ProjectListProps {
  projects: ProjectListResponse;
  loading?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (id: number) => void;
  onComplete?: (id: number) => void;
  onProjectClick?: (project: Project) => void;
}

export function ProjectList({ projects, loading, onEdit, onDelete, onComplete, onProjectClick }: ProjectListProps) {
  const projectList = Array.isArray(projects) ? projects : projects?.items || [];

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (projectList.length === 0) {
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
      {projectList.map((project: Project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          onComplete={onComplete}
          onClick={() => onProjectClick?.(project)}
        />
      ))}
    </div>
  );
}
