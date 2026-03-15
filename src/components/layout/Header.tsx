'use client';

import { useNavigationStore } from '@/stores/useNavigationStore';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { toggleSidebar } = useNavigationStore();

  return (
    <header className="hidden sm:flex bg-white border-b border-border px-4 py-3 items-center gap-4">
      <Button type="button" variant="ghost" size="sm" onClick={toggleSidebar}>
        ☰
      </Button>
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  );
}
