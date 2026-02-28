'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuthContext';

export interface NavLink {
  href: string;
  label: string;
  icon: string;
}

export const DASHBOARD_LINKS: NavLink[] = [
  { href: '/dashboard', label: 'Início', icon: '🏠' },
  { href: '/dashboard/profile', label: 'Meu Perfil', icon: '👤' },
  { href: '/dashboard/benefits', label: 'Meus Benefícios', icon: '🎁' },
  { href: '/dashboard/documents', label: 'Documentos', icon: '📄' },
  { href: '/dashboard/payments', label: 'Pagamentos', icon: '💰' },
  { href: '/dashboard/card', label: 'Carteirinha', icon: '💳' },
  { href: '/dashboard/events', label: 'Eventos', icon: '🎉' },
  { href: '/dashboard/forum', label: 'Fórum', icon: '💬' },
  { href: '/dashboard/showcase', label: 'Vitrine Virtual', icon: '🛒' },
  { href: '/dashboard/contact', label: 'Fale Conosco', icon: '📧' },
  { href: '/dashboard/lgpd', label: 'LGPD', icon: '🔒' },
];

interface DashboardNavProps {
  links?: NavLink[];
}

export function DashboardNav({ links = DASHBOARD_LINKS }: DashboardNavProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-[var(--primary)] text-white p-6 min-h-screen">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Área do Associado</h2>
        {user && (
          <p className="text-sm text-white/80">{user.name}</p>
        )}
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block py-2 px-4 rounded hover:bg-white/10 transition-colors ${
              pathname === link.href ? 'bg-white/20' : ''
            }`}
          >
            {link.icon} {link.label}
          </Link>
        ))}
        <button
          onClick={logout}
          className="w-full text-left block py-2 px-4 rounded hover:bg-white/10 transition-colors mt-4 border-t border-white/20 pt-4"
        >
          🚪 Sair
        </button>
      </nav>
    </aside>
  );
}
