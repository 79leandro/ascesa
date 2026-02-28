'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { perf } from '@/lib/performance';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'DIRECTOR' | 'ASSOCIATED';
  status: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  perf.start('AuthProvider init');

  const refreshUser = useCallback(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
    perf.end('AuthProvider init');
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback((token: string, userData: User) => {
    perf.start('auth login');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    perf.end('auth login');

    // Redirect based on role
    const redirectPath = userData.role === 'ADMIN' || userData.role === 'DIRECTOR'
      ? '/admin'
      : '/dashboard';
    router.push(redirectPath);
  }, [router]);

  const logout = useCallback(() => {
    perf.start('auth logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    perf.end('auth logout');
    router.push('/login');
  }, [router]);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Simplified hook for components that just need to check auth status
export function useAuthState() {
  const { user, isLoading, isAuthenticated } = useAuth();
  return { user, isLoading, isAuthenticated };
}
