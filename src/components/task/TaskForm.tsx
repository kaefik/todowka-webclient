'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import type { Task, TaskCreate, TaskUpdate } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectItem } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Spinner } from '@/components/ui/Spinner';
import type { Project, Context, Tag } from '@/types';

interface TaskFormData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  project_id?: number | string;
  context_id?: number | string;
  tag_ids?: number[];
  status?: 'inbox' | 'active' | 'waiting' | 'someday' | undefined;
  waiting_for?: string;
  move_to_active?: boolean;
}

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000).nullable().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  project_id: z.coerce.number().optional().or(z.literal('')),
  context_id: z.coerce.number().optional().or(z.literal('')),
  tag_ids: z.array(z.number()).optional(),
  status: z.enum(['inbox', 'active', 'waiting', 'someday']).optional(),
  waiting_for: z.string().optional(),
  move_to_active: z.boolean().optional(),
}).refine((data) => {
  if (data.status === 'waiting' && !data.waiting_for?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Waiting for is required when status is waiting",
  path: ['waiting_for'],
});

interface TaskFormProps {
  task?: Task;
  projects?: Project[];
  contexts?: Context[];
  tags?: Tag[];
  onSubmit: (data: TaskCreate | TaskUpdate) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  moveToActive?: boolean;
}

export function TaskForm({ task, projects, contexts, tags, onSubmit, onCancel, isSubmitting, moveToActive }: TaskFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      project_id: task?.project_id,
      context_id: task?.context_id,
      tag_ids: task?.tags?.map(t => t.id) || [],
      status: task?.status === 'completed' ? undefined : task?.status,
      waiting_for: task?.waiting_for,
      move_to_active: moveToActive !== undefined ? moveToActive : false,
    },
  });

  useEffect(() => {
    if (task) {
      console.log('[TaskForm] Received task for editing:', task);
      const resetData = {
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'medium',
        project_id: task.project_id,
        context_id: task.context_id,
        tag_ids: task.tags?.map(t => t.id) || [],
        status: task.status === 'completed' ? undefined : task.status,
        waiting_for: task.waiting_for,
        move_to_active: false,
      };
      console.log('[TaskForm] Resetting form with data:', resetData);
      reset(resetData);
    }
  }, [task, reset]);

  const handleSubmitWithLog = (data: TaskFormData) => {
    console.log('[TaskForm] Raw form data:', data);

    const submitData: TaskCreate | TaskUpdate = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      project_id: data.project_id && data.project_id !== '' ? parseInt(data.project_id as string) : null,
      context_id: data.context_id && data.context_id !== '' ? parseInt(data.context_id as string) : null,
      tag_ids: data.tag_ids,
    };

    console.log('[TaskForm] Before filtering:', submitData);

    if (data.move_to_active) {
      submitData.status = 'active';
    } else if (data.status) {
      submitData.status = data.status;
    }

    if (data.waiting_for) {
      submitData.waiting_for = data.waiting_for;
    }

    const filteredData = Object.fromEntries(
      Object.entries(submitData).filter(([_, v]) => v !== undefined)
    );

    console.log('[TaskForm] After filtering (sending to onSubmit):', filteredData);
    onSubmit(filteredData as TaskCreate | TaskUpdate);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitWithLog)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <Input {...register('title')} placeholder="Task title" />
        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea {...register('description')} placeholder="Task description" />
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || ''}
                onChange={(value) => field.onChange(value || undefined)}
                placeholder="Select priority"
              >
                <SelectItem value="">None</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </Select>
            )}
          />
          {errors.priority && <p className="text-red-600 text-sm mt-1">{errors.priority.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Project</label>
          <Controller
            name="project_id"
            control={control}
            render={({ field }) => (
              <Select
                value={typeof field.value === 'number' ? field.value.toString() : ''}
                onChange={(value) => field.onChange(value === '' ? null : parseInt(value))}
                placeholder="Select project"
              >
                <SelectItem value="">None</SelectItem>
                {projects?.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
          {errors.project_id && <p className="text-red-600 text-sm mt-1">{errors.project_id.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ''}
              onChange={(value) => field.onChange(value || undefined)}
              placeholder="Select status"
            >
              <SelectItem value="">None</SelectItem>
              <SelectItem value="inbox">Inbox</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="waiting">Waiting</SelectItem>
              <SelectItem value="someday">Someday</SelectItem>
            </Select>
          )}
        />
        {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Context</label>
        <Controller
          name="context_id"
          control={control}
          render={({ field }) => (
            <Select
              value={typeof field.value === 'number' ? field.value.toString() : ''}
              onChange={(value) => field.onChange(value === '' ? null : parseInt(value))}
              placeholder="Select context"
            >
              <SelectItem value="">None</SelectItem>
              {contexts?.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </Select>
          )}
        />
        {errors.context_id && <p className="text-red-600 text-sm mt-1">{errors.context_id.message}</p>}
      </div>

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <>
            {field.value === 'waiting' && (
              <div>
                <label className="block text-sm font-medium mb-1">Waiting for *</label>
                <Input
                  {...register('waiting_for')}
                  placeholder="Who or what are you waiting for?"
                />
                {errors.waiting_for && <p className="text-red-600 text-sm mt-1">{errors.waiting_for.message}</p>}
              </div>
            )}
          </>
        )}
      />

      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="space-y-2">
          <Controller
            name="tag_ids"
            control={control}
            render={({ field }) => (
              <>
                {tags?.map((tag) => (
                  <Checkbox
                    key={tag.id}
                    label={tag.name}
                    checked={field.value?.includes(tag.id) || false}
                    onChange={(checked) => {
                      const currentIds = field.value || [];
                      if (checked) {
                        field.onChange([...currentIds, tag.id]);
                      } else {
                        field.onChange(currentIds.filter((id) => id !== tag.id));
                      }
                    }}
                  />
                ))}
              </>
            )}
          />
        </div>
      </div>

      {moveToActive !== undefined || task?.status === 'inbox' ? (
        <div className="flex items-center gap-2">
          <Controller
            name="move_to_active"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="Move to Active"
                checked={field.value || false}
                onChange={field.onChange}
              />
            )}
          />
          <span className="text-sm text-slate-600">Remove from Inbox and set status to Active</span>
        </div>
      ) : null}

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner size="sm" /> : (task ? 'Update' : 'Create') + ' Task'}
        </Button>
      </div>
    </form>
  );
}
