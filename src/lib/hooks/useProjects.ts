'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsAPI } from '@/lib/api/projects';
import type { Project, ProjectCreate, ProjectUpdate, ProjectStatus } from '@/types';

export function useProjects(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['projects', page, limit],
    queryFn: () => projectsAPI.getAll(page, limit),
  });
}

export function useProject(id: number) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsAPI.getById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectCreate) => projectsAPI.create(data),
    onMutate: async (newProject) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const previousProjects = queryClient.getQueryData(['projects']);

      queryClient.setQueryData(['projects'], (old: any) => {
        const newItem = {
          ...newProject,
          id: Date.now(),
          status: 'active' as ProjectStatus,
          progress: 0,
          total_tasks: 0,
          completed_tasks: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Project;

        if (old?.items) {
          return { ...old, items: [newItem, ...old.items], total: old.total + 1 };
        }
        return { items: [newItem], total: 1 };
      });

      return { previousProjects };
    },
    onError: (err, newProject, context) => {
      queryClient.setQueryData(['projects'], (context as any)?.previousProjects);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProjectUpdate }) =>
      projectsAPI.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const previousProjects = queryClient.getQueryData(['projects']);

      queryClient.setQueryData(['projects'], (old: any) => {
        if (old?.items) {
          return {
            ...old,
            items: old.items.map((project: Project) =>
              project.id === id ? { ...project, ...data, updated_at: new Date().toISOString() } : project
            ),
          };
        }
        return old;
      });

      return { previousProjects };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['projects'], (context as any)?.previousProjects);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => projectsAPI.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const previousProjects = queryClient.getQueryData(['projects']);

      queryClient.setQueryData(['projects'], (old: any) => {
        if (old?.items) {
          return {
            ...old,
            items: old.items.filter((project: Project) => project.id !== id),
            total: old.total - 1,
          };
        }
        return old;
      });

      return { previousProjects };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['projects'], (context as any)?.previousProjects);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useCompleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => projectsAPI.complete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const previousProjects = queryClient.getQueryData(['projects']);

      queryClient.setQueryData(['projects'], (old: any) => {
        if (old?.items) {
          return {
            ...old,
            items: old.items.map((project: Project) =>
              project.id === id ? { ...project, status: 'completed' as ProjectStatus, updated_at: new Date().toISOString() } : project
            ),
          };
        }
        return old;
      });

      return { previousProjects };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['projects'], (context as any)?.previousProjects);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
