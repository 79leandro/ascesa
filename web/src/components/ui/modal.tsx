'use client';

import { forwardRef, HTMLAttributes, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ className, children, isOpen, onClose, title, description, size = 'md', showCloseButton = true, ...props }, ref) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      if (isOpen) {
        window.addEventListener('keydown', handleEscape);
      }
      return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!mounted || !isOpen) return null;

    const sizes = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in"
          onClick={onClose}
        />
        <div
          ref={ref}
          className={cn(
            'relative w-full bg-[var(--card)] rounded-2xl shadow-2xl animate-slide-up',
            sizes[size],
            className
          )}
          {...props}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <div>
                {title && <h2 className="text-xl font-semibold text-[var(--foreground)]">{title}</h2>}
                {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-all duration-200 p-2 rounded-lg hover:bg-[var(--gray-100)] -mr-2 -mt-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  loading = false,
}: ConfirmModalProps) {
  const variants = {
    danger: 'bg-[var(--error)] hover:bg-red-600',
    warning: 'bg-[var(--warning)] hover:bg-amber-600',
    info: 'bg-[var(--info)] hover:bg-blue-600',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-muted-foreground mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          className={cn('text-white', variants[variant])}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Processando...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
