import type { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
  className?: string;
}

export function MainContent({ children, className = '' }: MainContentProps) {
  return (
    <main className={`flex-1 p-4 lg:p-8 overflow-auto bg-background min-h-screen ${className}`}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </main>
  );
}
