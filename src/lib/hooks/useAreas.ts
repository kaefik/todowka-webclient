'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { areasAPI } from '@/lib/api/areas';
import type { Area, AreaCreate, AreaUpdate, AreaListResponse } from '@/types';

export function useAreas() {
  return useQuery({
    queryKey: ['areas'],
    queryFn: () => areasAPI.getAll(),
  });
}

export function useArea(id: number) {
  return useQuery({
    queryKey: ['area', id],
    queryFn: () => areasAPI.getById(id),
    enabled: !!id,
  });
}

export function useCreateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AreaCreate) => areasAPI.create(data),
    onMutate: async (newArea) => {
      await queryClient.cancelQueries({ queryKey: ['areas'] });
      const previousAreas = queryClient.getQueryData<AreaListResponse>(['areas']);

      queryClient.setQueryData(['areas'], (old: AreaListResponse | undefined) => {
        const newItem = {
          ...newArea,
          id: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Area;

        if (old && 'items' in old) {
          return { ...old, items: [newItem, ...old.items] };
        }
        return [newItem, ...(old || [])];
      });

      return { previousAreas };
    },
    onError: (err, newArea, context) => {
      queryClient.setQueryData(['areas'], (context as any)?.previousAreas);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
    },
  });
}

export function useUpdateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AreaUpdate }) =>
      areasAPI.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['areas'] });
      const previousAreas = queryClient.getQueryData<AreaListResponse>(['areas']);

      queryClient.setQueryData(['areas'], (old: AreaListResponse | undefined) => {
        if (old && 'items' in old) {
          return {
            ...old,
            items: old.items.map((area: Area) =>
              area.id === id ? { ...area, ...data, updated_at: new Date().toISOString() } : area
            ),
          };
        }
        return (old || []).map((area: Area) =>
          area.id === id ? { ...area, ...data, updated_at: new Date().toISOString() } : area
        );
      });

      return { previousAreas };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['areas'], (context as any)?.previousAreas);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
    },
  });
}

export function useDeleteArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => areasAPI.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['areas'] });
      const previousAreas = queryClient.getQueryData<AreaListResponse>(['areas']);

      queryClient.setQueryData(['areas'], (old: AreaListResponse | undefined) => {
        if (old && 'items' in old) {
          return { ...old, items: old.items.filter((area: Area) => area.id !== id) };
        }
        return (old || []).filter((area: Area) => area.id !== id);
      });

      return { previousAreas };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['areas'], (context as any)?.previousAreas);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
    },
  });
}
