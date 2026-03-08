'use client';

import { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

type FieldContextType = {
  name: string;
  error?: string;
};

const FieldContext = createContext<FieldContextType | null>(null);
const FormContext = createContext<{ errors: Record<string, { message?: string }> } | null>(null);

export interface FormProps {
  children: React.ReactNode;
  onSubmit: (data: Record<string, unknown>) => void;
  className?: string;
}

export function Form({ children, onSubmit, className }: FormProps) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); const formData = new FormData(e.currentTarget); const data: Record<string, unknown> = {}; formData.forEach((value, key) => { data[key] = value; }); onSubmit(data); }} className={className}>
      {children}
    </form>
  );
}

export function FormField({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <FieldContext.Provider value={{ name }}>
      {children}
    </FieldContext.Provider>
  );
}

interface FormItemProps {
  children: React.ReactNode;
  className?: string;
}

export function FormItem({ children, className }: FormItemProps) {
  const context = useContext(FieldContext);
  // Simplified error handling - can be extended with React Hook Form
  const error = (window as unknown as { formErrors?: Record<string, string> }).formErrors?.[context?.name || ''];

  return (
    <div className={cn('space-y-2', className)}>
      {children}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export function FormLabel({ children, className, required }: { children: React.ReactNode; className?: string; required?: boolean }) {
  return (
    <label className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

export function FormMessage({ children, className }: { children?: React.ReactNode; className?: string }) {
  if (!children) return null;

  return (
    <p className={cn('text-sm text-red-500', className)}>
      {children}
    </p>
  );
}

export function FormDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  );
}

// Hook for using form context
export function useFormField() {
  const context = useContext(FieldContext);
  if (!context) {
    throw new Error('useFormField must be used within a FormField');
  }
  return context;
}
