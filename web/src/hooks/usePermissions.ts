'use client';

import { useEffect, useState } from 'react';
import type { UserRole } from '@/lib/types';

export type Permission =
  // Dashboard - Associated
  | 'dashboard'
  | 'profile'
  | 'benefits'
  | 'documents'
  | 'payments'
  | 'card'
  | 'events'
  | 'forum'
  | 'showcase'
  | 'contact'
  // Admin
  | 'admin'
  | 'admin_benefits'
  | 'admin_partners'
  | 'admin_associates'
  | 'admin_documents'
  | 'admin_payments'
  | 'admin_assemblies'
  | 'admin_reports'
  | 'admin_blog'
  | 'admin_events'
  | 'admin_forum'
  | 'admin_showcase'
  | 'admin_settings';

export const PERMISSIONS: Record<UserRole, Permission[]> = {
  ASSOCIATED: [
    'dashboard',
    'profile',
    'benefits',
    'documents',
    'payments',
    'card',
    'events',
    'forum',
    'showcase',
    'contact',
  ],
  DIRECTOR: [
    'admin',
    'admin_benefits',
    'admin_partners',
    'admin_associates',
    'admin_documents',
    'admin_payments',
    'admin_assemblies',
    'admin_reports',
    'admin_blog',
    'admin_events',
    'admin_forum',
    'admin_showcase',
  ],
  ADMIN: [
    'admin',
    'admin_benefits',
    'admin_partners',
    'admin_associates',
    'admin_documents',
    'admin_payments',
    'admin_assemblies',
    'admin_reports',
    'admin_blog',
    'admin_events',
    'admin_forum',
    'admin_showcase',
    'admin_settings',
  ],
};

interface UsePermissionsReturn {
  hasPermission: (permission: Permission) => boolean;
  isAdmin: boolean;
  isDirector: boolean;
  isAssociated: boolean;
  role: UserRole | null;
  mounted: boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setRole(user.role as UserRole);
      } catch {
        setRole(null);
      }
    }
  }, []);

  const hasPermission = (permission: Permission): boolean => {
    if (!mounted || !role) return false;
    return PERMISSIONS[role]?.includes(permission) ?? false;
  };

  return {
    hasPermission,
    isAdmin: role === 'ADMIN',
    isDirector: role === 'DIRECTOR',
    isAssociated: role === 'ASSOCIATED',
    role,
    mounted,
  };
}

// Helper to redirect based on role
export function getRedirectPathByRole(role: UserRole | null): string {
  if (!role) return '/login';
  switch (role) {
    case 'ADMIN':
    case 'DIRECTOR':
      return '/admin';
    case 'ASSOCIATED':
    default:
      return '/dashboard';
  }
}
