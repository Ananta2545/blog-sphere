'use client';
import { TRPCProvider } from '../_trpc/Provider';
import { ToastProvider } from './ui/ToastContainer';
import { ThemeInitializer } from './ThemeInitializer';
import { ReactNode } from 'react';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <TRPCProvider>
      <ToastProvider>
        <ThemeInitializer />
        {children}
      </ToastProvider>
    </TRPCProvider>
  );
}
