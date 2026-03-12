'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsAPI } from '@/lib/api/tags';
import type { Tag, TagCreate, TagUpdate } from '@/types';

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsAPI.getAll(),
  });
}

export function useTag(id: number) {
  return useQuery({
    queryKey: ['tag', id],
    queryFn: () => tagsAPI.getById(id),
    enabled: !!id,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TagCreate) => tagsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TagUpdate }) =>
      tagsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tagsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
