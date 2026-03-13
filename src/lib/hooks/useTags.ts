'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsAPI } from '@/lib/api/tags';
import type { Tag, TagCreate, TagUpdate, TagListResponse } from '@/types';

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
    onMutate: async (newTag) => {
      await queryClient.cancelQueries({ queryKey: ['tags'] });
      const previousTags = queryClient.getQueryData<TagListResponse>(['tags']);

      queryClient.setQueryData(['tags'], (old: TagListResponse | undefined) => {
        const newItem = {
          ...newTag,
          id: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Tag;

        if (old && 'items' in old) {
          return { ...old, items: [newItem, ...old.items] };
        }
        return [newItem, ...(old || [])];
      });

      return { previousTags };
    },
    onError: (err, newTag, context) => {
      queryClient.setQueryData(['tags'], (context as any)?.previousTags);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TagUpdate }) =>
      tagsAPI.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tags'] });
      const previousTags = queryClient.getQueryData<TagListResponse>(['tags']);

      queryClient.setQueryData(['tags'], (old: TagListResponse | undefined) => {
        if (old && 'items' in old) {
          return {
            ...old,
            items: old.items.map((tag: Tag) =>
              tag.id === id ? { ...tag, ...data, updated_at: new Date().toISOString() } : tag
            ),
          };
        }
        return (old || []).map((tag: Tag) =>
          tag.id === id ? { ...tag, ...data, updated_at: new Date().toISOString() } : tag
        );
      });

      return { previousTags };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['tags'], (context as any)?.previousTags);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tagsAPI.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tags'] });
      const previousTags = queryClient.getQueryData<TagListResponse>(['tags']);

      queryClient.setQueryData(['tags'], (old: TagListResponse | undefined) => {
        if (old && 'items' in old) {
          return { ...old, items: old.items.filter((tag: Tag) => tag.id !== id) };
        }
        return (old || []).filter((tag: Tag) => tag.id !== id);
      });

      return { previousTags };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['tags'], (context as any)?.previousTags);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
