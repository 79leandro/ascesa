import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status?: string;
}

interface UseAdminAuthOptions {
  requiredRoles?: string[];
  redirectTo?: string;
}

export function useAdminAuth(options: UseAdminAuthOptions = {}) {
  const { requiredRoles = ['ADMIN', 'DIRECTOR'], redirectTo = '/dashboard' } = options;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    // Not authenticated
    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const user: User = JSON.parse(userStr);

      // Check role permissions
      if (!requiredRoles.includes(user.role)) {
        router.push(redirectTo);
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router, requiredRoles, redirectTo, mounted]);

  const getUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return {
    user: mounted ? getUser() : null,
    token: mounted ? getToken() : null,
    logout,
    mounted,
  };
}
