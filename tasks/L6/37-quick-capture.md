# L6-37 — Create QuickCapture component

## Goal

Implement quick task capture form for dashboard.

## Input

Task L4-17, L4-19, L5-29 completed.

## Output

`src/components/layout/QuickCapture.tsx` with QuickCapture component.

## Implementation

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
        {createTask.isPending ? '...' : '+'}
      </Button>
    </form>
  );
}
```

## Done When

- Creates task in Inbox on submit
- Clears form after submit
- Disabled while submitting
- Uses useCreateInboxTask hook

## Effort

M (2 hours)

## Depends On

L4-17, L4-19, L5-29 (needs hook from L7-40)
