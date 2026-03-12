'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { areasAPI } from '@/lib/api/areas';
import type { Area, AreaCreate, AreaUpdate } from '@/types';

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
    },
  });
}

export function useUpdateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AreaUpdate }) =>
      areasAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
    },
  });
}

export function useDeleteArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => areasAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
    },
  });
}
