'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]';

    const variants = {
      primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-light)] focus:ring-[var(--primary)] shadow-md hover:shadow-lg hover:-translate-y-0.5',
      secondary: 'bg-[var(--secondary)] text-white hover:bg-[var(--secondary-light)] focus:ring-[var(--secondary)] shadow-md hover:shadow-lg hover:-translate-y-0.5',
      outline: 'border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white shadow-sm hover:shadow-md',
      ghost: 'text-[var(--foreground)] hover:bg-[var(--gray-100)] dark:hover:bg-[var(--gray-800)] hover:translate-x-0.5',
      danger: 'bg-[var(--error)] text-white hover:bg-red-600 focus:ring-[var(--error)] shadow-md hover:shadow-lg hover:-translate-y-0.5',
      link: 'text-[var(--primary)] hover:text-[var(--primary-light)] underline-offset-4 hover:underline p-0 h-auto',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-5 py-2.5 text-base rounded-xl',
      lg: 'px-7 py-3.5 text-lg rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], variant !== 'link' && sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
