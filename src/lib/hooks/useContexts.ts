'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contextsAPI } from '@/lib/api/contexts';
import type { Context, ContextCreate, ContextUpdate, ContextListResponse } from '@/types';

export function useContexts() {
  return useQuery({
    queryKey: ['contexts'],
    queryFn: () => contextsAPI.getAll(),
  });
}

export function useContext(id: number) {
  return useQuery({
    queryKey: ['context', id],
    queryFn: () => contextsAPI.getById(id),
    enabled: !!id,
  });
}

export function useCreateContext() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ContextCreate) => contextsAPI.create(data),
    onMutate: async (newContext) => {
      await queryClient.cancelQueries({ queryKey: ['contexts'] });
      const previousContexts = queryClient.getQueryData<ContextListResponse>(['contexts']);

      queryClient.setQueryData(['contexts'], (old: ContextListResponse | undefined) => {
        const newItem = {
          ...newContext,
          id: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Context;

        if (old && 'items' in old) {
          return { ...old, items: [newItem, ...old.items] };
        }
        return [newItem, ...(old || [])];
      });

      return { previousContexts };
    },
    onError: (err, newContext, context) => {
      queryClient.setQueryData(['contexts'], (context as any)?.previousContexts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contexts'] });
    },
  });
}

export function useUpdateContext() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ContextUpdate }) =>
      contextsAPI.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['contexts'] });
      const previousContexts = queryClient.getQueryData<ContextListResponse>(['contexts']);

      queryClient.setQueryData(['contexts'], (old: ContextListResponse | undefined) => {
        if (old && 'items' in old) {
          return {
            ...old,
            items: old.items.map((context: Context) =>
              context.id === id ? { ...context, ...data, updated_at: new Date().toISOString() } : context
            ),
          };
        }
        return (old || []).map((context: Context) =>
          context.id === id ? { ...context, ...data, updated_at: new Date().toISOString() } : context
        );
      });

      return { previousContexts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['contexts'], (context as any)?.previousContexts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contexts'] });
    },
  });
}

export function useDeleteContext() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contextsAPI.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['contexts'] });
      const previousContexts = queryClient.getQueryData<ContextListResponse>(['contexts']);

      queryClient.setQueryData(['contexts'], (old: ContextListResponse | undefined) => {
        if (old && 'items' in old) {
          return { ...old, items: old.items.filter((context: Context) => context.id !== id) };
        }
        return (old || []).filter((context: Context) => context.id !== id);
      });

      return { previousContexts };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['contexts'], (context as any)?.previousContexts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contexts'] });
    },
  });
}
