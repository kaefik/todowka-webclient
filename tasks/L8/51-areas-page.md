# L8-51 — Create Areas page (app/areas/page.tsx)

## Goal

Implement areas management with CRUD.

## Input

Task L7-43, L5-29 completed.

## Output

`src/app/(dashboard)/areas/page.tsx` with areas page.

## Implementation

```typescript
'use client';

import { useAreas } from '@/lib/hooks/useAreas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCreateArea, useUpdateArea, useDeleteArea } from '@/lib/hooks/useAreas';
import { useState } from 'react';
import type { Area } from '@/types';

export default function AreasPage() {
  const { data: areas } = useAreas();
  const createArea = useCreateArea();
  const updateArea = useUpdateArea();
  const deleteArea = useDeleteArea();

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      createArea.mutate({ name: newName });
      setNewName('');
    }
  };

  const handleUpdate = (id: number) => {
    if (editName.trim()) {
      updateArea.mutate({ id, data: { name: editName } });
      setEditingId(null);
      setEditName('');
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this area?')) {
      deleteArea.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Areas</h1>

      {/* Create */}
      <div className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New area name"
        />
        <Button variant="primary" onClick={handleCreate}>
          Create
        </Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {areas?.map((area) => (
          <div key={area.id} className="p-3 bg-white border border-border rounded-lg flex items-center gap-2">
            {editingId === area.id ? (
              <>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1"
                />
                <Button variant="primary" size="sm" onClick={() => handleUpdate(area.id)}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1">{area.name}</span>
                <Button variant="ghost" size="sm" onClick={() => {
                  setEditingId(area.id);
                  setEditName(area.name);
                }}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(area.id)}>
                  Delete
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Done When

- Displays areas
- CRUD operations work

## Effort

M (2 hours)

## Depends On

L7-43
