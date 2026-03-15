import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryClientProvider } from '@/lib/QueryClientProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { MainContent } from '@/components/layout/MainContent';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { APIErrorHandler } from '@/components/APIErrorHandler';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ToDowka - GTD Task Management',
  description: 'Personal GTD task management app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <QueryClientProvider>
            <div className="flex min-h-screen flex-col">
              <div className="flex flex-1">
                <Sidebar />
                <MainContent className="pb-16 sm:pb-0">{children}</MainContent>
              </div>
              <BottomNavigation />
            </div>
            <APIErrorHandler />
          </QueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
