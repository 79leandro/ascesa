'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 rounded-lg border
            bg-[var(--background)] text-[var(--foreground)]
            border-[var(--border)] focus:border-[var(--ring)]
            focus:ring-2 focus:ring-[var(--ring)] focus:ring-opacity-50
            outline-none transition-colors
            placeholder:text-[var(--muted-foreground)]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[var(--error)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
