'use client';

import { cn } from '@/lib/utils';
import { Spinner } from './spinner';

export interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ isLoading, children, message, className }: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Carregando...' }: PageLoaderProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}

export interface InlineLoaderProps {
  size?: 'sm' | 'md' | 'lg';
}

export function InlineLoader({ size = 'md' }: InlineLoaderProps) {
  return (
    <div className="flex items-center gap-2">
      <Spinner size={size} />
    </div>
  );
}
