'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuthContext';
import { useEffect } from 'react';

export interface AdminLink {
  href: string;
  label: string;
  icon: string;
  roles: string[]; // Which roles can see this link
}

// Links disponíveis para ADMIN - acesso completo
const ADMIN_LINKS: AdminLink[] = [
  { href: '/admin', label: 'Dashboard', icon: '📊', roles: ['ADMIN'] },
  { href: '/admin/benefits', label: 'Convênios', icon: '🎁', roles: ['ADMIN'] },
  { href: '/admin/partners', label: 'Parceiros', icon: '🤝', roles: ['ADMIN'] },
  { href: '/admin/associates', label: 'Associados', icon: '👥', roles: ['ADMIN'] },
  { href: '/admin/documents', label: 'Documentos', icon: '📄', roles: ['ADMIN'] },
  { href: '/admin/payments', label: 'Pagamentos', icon: '💳', roles: ['ADMIN'] },
  { href: '/admin/assemblies', label: 'Assembleias', icon: '🏛️', roles: ['ADMIN'] },
  { href: '/admin/reports', label: 'Relatórios', icon: '📈', roles: ['ADMIN'] },
  { href: '/admin/blog', label: 'Blog', icon: '📰', roles: ['ADMIN'] },
  { href: '/admin/events', label: 'Eventos', icon: '🎉', roles: ['ADMIN'] },
  { href: '/admin/forum', label: 'Fórum', icon: '💬', roles: ['ADMIN'] },
  { href: '/admin/showcase', label: 'Vitrine', icon: '🛒', roles: ['ADMIN'] },
  { href: '/admin/settings', label: 'Configurações', icon: '⚙️', roles: ['ADMIN'] },
];

// Links disponíveis para ASSOCIADO - área restrita
const ASSOCIATE_LINKS: AdminLink[] = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['ASSOCIADO'] },
  { href: '/dashboard/profile', label: 'Meu Perfil', icon: '👤', roles: ['ASSOCIADO'] },
  { href: '/dashboard/benefits', label: 'Meus Benefícios', icon: '🎁', roles: ['ASSOCIADO'] },
  { href: '/dashboard/documents', label: 'Meus Documentos', icon: '📄', roles: ['ASSOCIADO'] },
  { href: '/dashboard/payments', label: 'Meus Pagamentos', icon: '💳', roles: ['ASSOCIADO'] },
  { href: '/dashboard/card', label: 'Carteirinha', icon: '💳', roles: ['ASSOCIADO'] },
  { href: '/dashboard/events', label: 'Eventos', icon: '🎉', roles: ['ASSOCIADO'] },
  { href: '/dashboard/forum', label: 'Fórum', icon: '💬', roles: ['ASSOCIADO'] },
  { href: '/dashboard/showcase', label: 'Vitrine Virtual', icon: '🛒', roles: ['ASSOCIADO'] },
  { href: '/dashboard/contact', label: 'Fale Conosco', icon: '📧', roles: ['ASSOCIADO'] },
  { href: '/dashboard/lgpd', label: 'LGPD', icon: '🔒', roles: ['ASSOCIADO'] },
];

// Links disponíveis para USUARIO (não associado)
const USER_LINKS: AdminLink[] = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['USUARIO'] },
  { href: '/dashboard/profile', label: 'Meu Perfil', icon: '👤', roles: ['USUARIO'] },
  { href: '/dashboard/benefits', label: 'Benefícios', icon: '🎁', roles: ['USUARIO'] },
  { href: '/dashboard/contact', label: 'Fale Conosco', icon: '📧', roles: ['USUARIO'] },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    // Se não está autenticado, redireciona para login
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Se é USUARIO, redireciona para dashboard
    if (user?.role === 'USUARIO' && pathname.startsWith('/admin')) {
      router.push('/dashboard');
    }
  }, [user, isAuthenticated, pathname, router]);

  if (!user) {
    return null;
  }

  // Define os links baseado no perfil
  let links: AdminLink[] = [];
  let title = 'Painel';

  switch (user.role) {
    case 'ADMIN':
      links = ADMIN_LINKS;
      title = 'Painel Admin';
      break;
    case 'ASSOCIADO':
      links = ASSOCIATE_LINKS;
      title = 'Área do Associado';
      break;
    case 'USUARIO':
      links = USER_LINKS;
      title = 'Área do Usuário';
      break;
    default:
      // Se não tem perfil reconhecido, mostra apenas dashboard
      links = USER_LINKS;
      title = 'Dashboard';
  }

  const isAdminArea = pathname.startsWith('/admin');

  return (
    <aside className="w-64 bg-[var(--primary)] text-white p-6 min-h-screen">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-sm text-white/80">{user.name}</p>
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
          {user.role === 'ADMIN' ? 'Administrador' : user.role === 'ASSOCIADO' ? 'Associado' : 'Usuário'}
        </span>
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
