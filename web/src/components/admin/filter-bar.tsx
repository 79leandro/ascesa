'use client';

import { ReactNode } from 'react';
import { Input } from '@/components/ui/input';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterConfig[];
  children?: ReactNode;
}

export function FilterBar({
  searchPlaceholder = 'Buscar...',
  searchValue,
  onSearchChange,
  filters,
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
      {filters?.map((filter, index) => (
        <select
          key={index}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className="px-4 py-2 border border-[var(--border)] rounded-lg bg-white min-w-[150px]"
        >
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
      {children}
    </div>
  );
}
