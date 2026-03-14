'use client';

import type { Project } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/project/ProgressBar';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: number) => void;
  onComplete?: (id: number) => void;
}

export function ProjectCard({ project, onEdit, onDelete, onComplete }: ProjectCardProps) {
  return (
    <div className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <Badge variant="status" value={project.status as any} />
          </div>
          {project.description && (
            <p className="text-sm text-slate-600">{project.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => onEdit?.(project)}>
            Edit
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={() => onComplete?.(project.id)}>
            ✓
          </Button>
          <Button type="button" variant="destructive" size="sm" onClick={() => onDelete?.(project.id)}>
            ✕
          </Button>
        </div>
      </div>

      <ProgressBar progress={project.progress} />

      <div className="mt-2 text-sm text-slate-600">
        {project.completed_tasks ?? 0} / {project.total_tasks ?? 0} tasks
      </div>
    </div>
  );
}
