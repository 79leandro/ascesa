'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface AdminLink {
  href: string;
  label: string;
  icon: string;
}

const DEFAULT_LINKS: AdminLink[] = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/benefits', label: 'Convênios', icon: '🎁' },
  { href: '/admin/partners', label: 'Parceiros', icon: '🤝' },
  { href: '/admin/associates', label: 'Associados', icon: '👥' },
  { href: '/admin/documents', label: 'Documentos', icon: '📄' },
  { href: '/admin/payments', label: 'Pagamentos', icon: '💳' },
  { href: '/admin/assemblies', label: 'Assembleias', icon: '🏛️' },
  { href: '/admin/reports', label: 'Relatórios', icon: '📈' },
  { href: '/admin/blog', label: 'Blog', icon: '📰' },
  { href: '/admin/events', label: 'Eventos', icon: '🎉' },
  { href: '/admin/settings', label: 'Configurações', icon: '⚙️' },
];

interface AdminSidebarProps {
  links?: AdminLink[];
  title?: string;
}

export function AdminSidebar({ links = DEFAULT_LINKS, title = 'Painel Admin' }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[var(--primary)] text-white p-6 min-h-screen">
      <h2 className="text-xl font-bold mb-8">{title}</h2>
      <nav className="space-y-2">
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
        <Link
          href="/dashboard"
          className="block py-2 px-4 rounded hover:bg-white/10 transition-colors mt-4 border-t border-white/20 pt-4"
        >
          ← Voltar ao Site
        </Link>
      </nav>
    </aside>
  );
}
