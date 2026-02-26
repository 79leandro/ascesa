'use client';

import { ReactNode } from 'react';
import { Input } from '@/components/ui/input';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterOption[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  children?: ReactNode;
}

export function FilterBar({
  searchPlaceholder = 'Buscar...',
  searchValue,
  onSearchChange,
  filters,
  filterValue,
  onFilterChange,
  children,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Input
        type="text"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
      {filters && onFilterChange && (
        <select
          value={filterValue || ''}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-4 py-2 border border-[var(--border)] rounded-lg bg-white min-w-[150px]"
        >
          {filters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      )}
      {children}
    </div>
  );
}
