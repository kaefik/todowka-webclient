'use client';

import { useContexts, useCreateContext, useUpdateContext, useDeleteContext } from '@/lib/hooks/useContexts';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useState } from 'react';
import type { Context, ContextListResponse } from '@/types';

export default function ContextsPage() {
  const { data: contexts } = useContexts();
  const createContext = useCreateContext();
  const updateContext = useUpdateContext();
  const deleteContext = useDeleteContext();

  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      createContext.mutate({ name: newName, description: newDesc });
      setNewName('');
      setNewDesc('');
    }
  };

  const handleUpdate = (id: number) => {
    if (editName.trim()) {
      updateContext.mutate({ id, data: { name: editName, description: editDesc } });
      setEditingId(null);
      setEditName('');
      setEditDesc('');
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this context?')) {
      deleteContext.mutate(id);
    }
  };

  const contextList = Array.isArray(contexts) ? contexts : (contexts as any)?.items || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contexts</h1>

      <div className="p-4 bg-white border border-border rounded-lg space-y-3">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New context name"
        />
        <Textarea
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder="Description"
          rows={2}
        />
        <Button variant="primary" onClick={handleCreate}>
          Create
        </Button>
      </div>

      <div className="space-y-2">
        {contextList.map((context: Context) => (
          <div key={context.id} className="p-3 bg-white border border-border rounded-lg">
            {editingId === context.id ? (
              <div className="space-y-3">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Name"
                />
                <Textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Description"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => handleUpdate(context.id)}>
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{context.name}</h3>
                    {context.description && (
                      <p className="text-sm text-foreground-secondary">{context.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                      setEditingId(context.id);
                      setEditName(context.name);
                      setEditDesc(context.description || '');
                    }}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(context.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
