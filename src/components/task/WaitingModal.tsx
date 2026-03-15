'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import type { Task } from '@/types';

interface WaitingModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSubmit: (id: number, waitingFor: string) => void;
  isSubmitting?: boolean;
}

export function WaitingModal({ isOpen, onClose, task, onSubmit, isSubmitting }: WaitingModalProps) {
  const [waitingFor, setWaitingFor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task && waitingFor.trim()) {
      onSubmit(task.id, waitingFor.trim());
      setWaitingFor('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Set Waiting: ${task?.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Waiting for *</label>
          <Input
            type="text"
            placeholder="Who or what are you waiting for?"
            value={waitingFor}
            onChange={(e) => setWaitingFor(e.target.value)}
            autoFocus
          />
        </div>
        <div className="text-sm text-slate-600">
          This task will be moved to the Waiting list and hidden from Next Actions.
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!waitingFor.trim() || isSubmitting}>
            {isSubmitting ? <Spinner size="sm" /> : 'Set Waiting'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
