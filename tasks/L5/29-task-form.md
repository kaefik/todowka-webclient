# L5-29 — Create TaskForm component

## Goal

Implement task creation/editing form with React Hook Form and Zod validation.

## Input

Task L4-17, L4-19, L4-20, L4-21 completed, Task L1-04 completed.

## Output

`src/components/task/TaskForm.tsx` with TaskForm component.

## Implementation

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Task, TaskCreate, TaskUpdate } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectItem } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import type { Project, Context, Tag } from '@/types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  project_id: z.coerce.number().optional(),
  context_id: z.coerce.number().optional(),
  tag_ids: z.array(z.number()).optional(),
});

interface TaskFormProps {
  task?: Task;
  projects?: Project[];
  contexts?: Context[];
  tags?: Tag[];
  onSubmit: (data: TaskCreate | TaskUpdate) => void;
  onCancel?: () => void;
}

export function TaskForm({ task, projects, contexts, tags, onSubmit, onCancel }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskCreate | TaskUpdate>({
    resolver: zodResolver(taskSchema),
    defaultValues: task || {
      title: '',
      description: '',
      priority: 'medium',
      tag_ids: [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <Select {...register('priority')} placeholder="Select priority">
            <SelectItem value="">None</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Project</label>
          <Select {...register('project_id')} placeholder="Select project">
            <SelectItem value="">None</SelectItem>
            {projects?.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Context</label>
        <Select {...register('context_id')} placeholder="Select context">
          <SelectItem value="">None</SelectItem>
          {contexts?.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="space-y-2">
          {tags?.map((tag) => (
            <Checkbox
              key={tag.id}
              label={tag.name}
              {...register('tag_ids')}
              value={tag.id}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{task ? 'Update' : 'Create'} Task</Button>
      </div>
    </form>
  );
}
```

## Done When

- Form validates with Zod
- All fields work (title, description, priority, project, context, tags)
- Submit calls onSubmit with data
- Errors display

## Effort

M (2 hours)

## Depends On

L4-17, L4-19, L4-20, L4-21, L1-04
