'use client';

import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, iconLeft, iconRight, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg border bg-[var(--background)] text-[var(--foreground)]',
              'border-[var(--border)] transition-all duration-200',
              'focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)] focus:ring-opacity-20',
              'outline-none',
              'placeholder:text-[var(--muted-foreground)]',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--gray-100)]',
              'hover:border-[var(--gray-300)]',
              error ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)] focus:ring-opacity-20' : '',
              iconLeft ? 'pl-10' : '',
              iconRight ? 'pr-10' : '',
              className
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
              {iconRight}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
