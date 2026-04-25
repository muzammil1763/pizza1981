'use client';

import { SessionProvider } from 'next-auth/react';
import { AppProvider } from '@/lib/app-context';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppProvider>
        {children}
        <Toaster position="top-right" richColors />
      </AppProvider>
    </SessionProvider>
  );
}
