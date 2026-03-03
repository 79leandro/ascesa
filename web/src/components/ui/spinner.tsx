'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent',
          sizes[size],
          className
        )}
        {...props}
      >
        <span className="sr-only">Carregando...</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  text?: string;
}

export const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, text = 'Carregando...', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center gap-3 py-12', className)}
        {...props}
      >
        <Spinner size="lg" />
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    );
  }
);

Loading.displayName = 'Loading';
