'use client';

import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from '@/lib/hooks/useTags';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import type { Tag } from '@/types';

const colorOptions = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'];

export default function TagsPage() {
  const { data: tags } = useTags();
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#000000');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#000000');

  const handleCreate = () => {
    if (newName.trim()) {
      createTag.mutate({ name: newName, color: newColor });
      setNewName('');
      setNewColor('#000000');
    }
  };

  const handleUpdate = (id: number) => {
    if (editName.trim()) {
      updateTag.mutate({ id, data: { name: editName, color: editColor } });
      setEditingId(null);
      setEditName('');
      setEditColor('#000000');
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this tag?')) {
      deleteTag.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tags</h1>

      <div className="p-4 bg-white border border-border rounded-lg space-y-3">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New tag name"
        />
        <div className="flex gap-2 items-center">
          <label>Color:</label>
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-10 h-10 rounded border border-border"
          />
        </div>
        <Button variant="primary" onClick={handleCreate}>
          Create
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tags?.map((tag) => (
          <div key={tag.id} className="p-3 bg-white border border-border rounded-lg">
            {editingId === tag.id ? (
              <div className="space-y-3">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Name"
                />
                <div className="flex gap-2 items-center">
                  <label>Color:</label>
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-10 h-10 rounded border border-border"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => handleUpdate(tag.id)}>
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: tag.color || '#000000' }}
                />
                <span className="flex-1">{tag.name}</span>
                <Button variant="ghost" size="sm" onClick={() => {
                  setEditingId(tag.id);
                  setEditName(tag.name);
                  setEditColor(tag.color || '#000000');
                }}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(tag.id)}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
