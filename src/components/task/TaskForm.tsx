'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Task, TaskCreate, TaskUpdate } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectItem } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Spinner } from '@/components/ui/Spinner';
import type { Project, Context, Tag } from '@/types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000).nullable().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  project_id: z.coerce.number().optional().or(z.literal('')),
  context_id: z.coerce.number().optional().or(z.literal('')),
  tag_ids: z.array(z.number()).optional(),
});

interface TaskFormProps {
  task?: Task;
  projects?: Project[];
  contexts?: Context[];
  tags?: Tag[];
  onSubmit: (data: TaskCreate | TaskUpdate) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function TaskForm({ task, projects, contexts, tags, onSubmit, onCancel, isSubmitting }: TaskFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskCreate | TaskUpdate>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      project_id: task?.project_id,
      context_id: task?.context_id,
      tag_ids: task?.tags?.map(t => t.id) || [],
    },
  });

  const handleSubmitWithLog = (data: TaskCreate | TaskUpdate) => {
    console.log('Form data submitted:', data);
    onSubmit(data);
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
                value={field.value?.toString() || ''}
                onChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
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
        <label className="block text-sm font-medium mb-1">Context</label>
        <Controller
          name="context_id"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value?.toString() || ''}
              onChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
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
