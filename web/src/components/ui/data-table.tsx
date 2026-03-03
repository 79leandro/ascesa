'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  zebraStriping?: boolean;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyField,
  sortKey,
  sortDirection,
  onSort,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado',
  zebraStriping = false,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[var(--gray-50)] to-[var(--gray-100)] border-b-2 border-[var(--border)]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-4 text-left text-sm font-semibold text-[var(--gray-700)]',
                    'transition-colors duration-200',
                    column.sortable && 'cursor-pointer select-none hover:bg-[var(--gray-200)]',
                    column.className
                  )}
                  onClick={() => column.sortable && onSort?.(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && (
                      <span className={cn(
                        'transition-transform duration-200',
                        sortKey === column.key ? 'text-[var(--primary)]' : 'text-[var(--gray-400)]'
                      )}>
                        {sortKey === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-muted-foreground">
                  Carregando...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={String(row[keyField])}
                  className={cn(
                    'transition-all duration-200',
                    'hover:bg-[var(--primary)]/5 hover:shadow-sm -mx-6 px-6',
                    zebraStriping && index % 2 === 1 && 'bg-[var(--gray-50)]/50'
                  )}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={cn('px-6 py-4 text-sm', column.className)}>
                      {column.cell ? column.cell(row) : String(row[column.key as keyof T] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className={cn('flex items-center justify-center gap-1 py-4', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--gray-100)] hover:shadow-sm"
      >
        Anterior
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            'min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            page === currentPage
              ? 'bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--primary-light)]'
              : 'hover:bg-[var(--gray-100)] hover:shadow-sm'
          )}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--gray-100)] hover:shadow-sm"
      >
        Próxima
      </button>
    </div>
  );
}
