'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Project, ProjectCreate, ProjectUpdate, Area } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectItem } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500).optional(),
  area_id: z.string().optional(),
});

interface ProjectFormProps {
  project?: Project;
  areas?: Area[];
  onSubmit: (data: ProjectCreate | ProjectUpdate) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function ProjectForm({ project, areas, onSubmit, onCancel, isSubmitting }: ProjectFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(projectSchema),
    defaultValues: project ? {
      name: project.name,
      description: project.description || '',
      area_id: project.area_id?.toString() || '',
    } : {
      name: '',
      description: '',
    },
  });

  const handleSubmitWithTransform = (data: any) => {
    const transformedData = {
      name: data.name,
      description: data.description,
      area_id: data.area_id && data.area_id !== '' ? parseInt(data.area_id) : undefined,
    };
    onSubmit(transformedData);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitWithTransform)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Project name" />
          )}
        />
        {errors.name && typeof errors.name.message === 'string' && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea {...field} placeholder="Project description" />
          )}
        />
        {errors.description && typeof errors.description.message === 'string' && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Area</label>
        <Controller
          name="area_id"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value?.toString() || ''}
              onChange={(value) => field.onChange(value || undefined)}
              placeholder="Select area"
            >
              <SelectItem value="">None</SelectItem>
              {areas?.map((area) => (
                <SelectItem key={area.id} value={area.id.toString()}>
                  {area.name}
                </SelectItem>
              ))}
            </Select>
          )}
        />
        {errors.area_id && typeof errors.area_id.message === 'string' && <p className="text-red-600 text-sm mt-1">{errors.area_id.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner size="sm" /> : (project ? 'Update' : 'Create') + ' Project'}
        </Button>
      </div>
    </form>
  );
}
