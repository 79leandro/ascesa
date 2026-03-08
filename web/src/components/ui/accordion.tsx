'use client';

import { useState, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

type AccordionContextType = {
  allowMultiple: boolean;
  openItems: string[];
  toggleItem: (id: string) => void;
};

const AccordionContext = createContext<AccordionContextType | null>(null);

export interface AccordionProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
  defaultValue?: string | string[];
  className?: string;
}

export function Accordion({ children, allowMultiple = false, defaultValue, className }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(() => {
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      if (allowMultiple) {
        return prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      }
      return prev.includes(id) ? [] : [id];
    });
  };

  return (
    <AccordionContext.Provider value={{ allowMultiple, openItems, toggleItem }}>
      <div className={cn('divide-y divide-border rounded-lg border border-border', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ children, value }: { children: React.ReactNode; value: string }) {
  return <div className="overflow-hidden">{children}</div>;
}

export function AccordionTrigger({ children, value }: { children: React.ReactNode; value: string }) {
  const context = useContext(AccordionContext);
  if (!context) return null;

  const { openItems, toggleItem } = context;
  const isOpen = openItems.includes(value);

  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      className={cn(
        'flex w-full items-center justify-between px-4 py-3 text-left font-medium transition-colors',
        'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isOpen ? 'bg-muted/50 text-primary' : 'text-foreground'
      )}
    >
      {children}
      <svg
        className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180')}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

export function AccordionContent({ children, value }: { children: React.ReactNode; value: string }) {
  const context = useContext(AccordionContext);
  if (!context) return null;

  const { openItems } = context;
  const isOpen = openItems.includes(value);

  if (!isOpen) return null;

  return (
    <div className="px-4 py-3 text-sm text-muted-foreground animate-accordion-down">
      {children}
    </div>
  );
}
