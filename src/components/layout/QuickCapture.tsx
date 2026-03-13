'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useCreateInboxTask } from '@/lib/hooks/useInbox';

export function QuickCapture() {
  const [title, setTitle] = useState('');
  const createTask = useCreateInboxTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createTask.mutateAsync({ title });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Quick add task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={!title.trim() || createTask.isPending}>
        {createTask.isPending ? <Spinner size="sm" /> : '+'}
      </Button>
    </form>
  );
}
