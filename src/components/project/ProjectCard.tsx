'use client';

import { useState } from 'react';
import type { Project } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/project/ProgressBar';
import { ProjectActionMenu } from './ProjectActionMenu';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: number) => void;
  onComplete?: (id: number) => void;
  onClick?: () => void;
}

export function ProjectCard({ project, onEdit, onDelete, onComplete, onClick }: ProjectCardProps) {
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  return (
    <div className="p-3 sm:p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2 sm:mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-base sm:text-lg truncate">{project.name}</h3>
            <Badge variant="status" value={project.status as any} />
          </div>
          {project.description && (
            <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>
          )}
        </div>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-2 sm:hidden">
            <Button type="button" variant="primary" size="xs" onClick={() => onComplete?.(project.id)}>
              ✓
            </Button>
            <Button type="button" variant="ghost" size="xs" onClick={() => setActionMenuOpen(true)}>
              •••
            </Button>
            <ProjectActionMenu
              project={project}
              isOpen={actionMenuOpen}
              onClose={() => setActionMenuOpen(false)}
              onEdit={() => onEdit?.(project)}
              onDelete={() => onDelete?.(project.id)}
            />
          </div>
          <div className="hidden sm:flex gap-2">
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
      </div>

      <ProgressBar progress={project.progress} />

      <div className="mt-2 text-sm text-slate-600">
        {project.completed_tasks ?? 0} / {project.total_tasks ?? 0} tasks
      </div>
    </div>
  );
}
