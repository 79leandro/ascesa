'use client';

import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  position: TooltipPosition;
  content: React.ReactNode;
}

const TooltipContext = createContext<TooltipContextType | null>(null);

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
}

export function Tooltip({ content, children, position = 'top', delay = 300 }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(false);
  };

  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen, position, content }}>
      <div
        className="relative inline-flex"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
}

export function TooltipContent() {
  const context = useContext(TooltipContext);
  if (!context) return null;

  const { isOpen, position, content } = context;
  if (!isOpen) return null;

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const animationClasses = {
    top: 'animate-slide-down',
    bottom: 'animate-slide-up',
    left: 'animate-slide-right',
    right: 'animate-slide-left',
  };

  return (
    <div
      className={cn(
        'absolute z-50 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white shadow-lg',
        positionClasses[position],
        animationClasses[position]
      )}
      role="tooltip"
    >
      {content}
      <div
        className={cn(
          'absolute h-2 w-2 rotate-45 bg-gray-900',
          position === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
          position === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
          position === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2',
          position === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2'
        )}
      />
    </div>
  );
}

export function TooltipTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
