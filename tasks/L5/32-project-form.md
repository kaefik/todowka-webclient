# L5-32 — Create ProjectForm component

## Goal

Implement project creation/editing form with validation.

## Input

Task L4-17, L4-19 completed, Task L1-04 completed.

## Output

`src/components/project/ProjectForm.tsx` with ProjectForm component.

## Implementation

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Project, ProjectCreate, ProjectUpdate } from '@/types';
import type { Area } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectItem } from '@/components/ui/Select';

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500).optional(),
  area_id: z.coerce.number().optional(),
});

interface ProjectFormProps {
  project?: Project;
  areas?: Area[];
  onSubmit: (data: ProjectCreate | ProjectUpdate) => void;
  onCancel?: () => void;
}

export function ProjectForm({ project, areas, onSubmit, onCancel }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectCreate | ProjectUpdate>({
    resolver: zodResolver(projectSchema),
    defaultValues: project || {
      name: '',
      description: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <Input {...register('name')} placeholder="Project name" />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea {...register('description')} placeholder="Project description" />
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Area</label>
        <Select {...register('area_id')} placeholder="Select area">
          <SelectItem value="">None</SelectItem>
          {areas?.map((area) => (
            <SelectItem key={area.id} value={area.id}>
              {area.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{project ? 'Update' : 'Create'} Project</Button>
      </div>
    </form>
  );
}
```

## Done When

- Form validates with Zod
- All fields work (name, description, area)
- Submit calls onSubmit with data
- Errors display

## Effort

M (2 hours)

## Depends On

L4-17, L4-19, L1-04
