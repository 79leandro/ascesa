'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SIDEBAR_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/benefits', label: 'Convênios', icon: '🎁' },
  { href: '/admin/blog', label: 'Blog', icon: '📰' },
  { href: '/admin/associates', label: 'Associados', icon: '👥' },
  { href: '/admin/documents', label: 'Documentos', icon: '📄' },
  { href: '/admin/payments', label: 'Pagamentos', icon: '💳' },
  { href: '/admin/assemblies', label: 'Assembleias', icon: '🏛️' },
  { href: '/admin/reports', label: 'Relatórios', icon: '📈' },
  { href: '/admin/partners', label: 'Parceiros', icon: '🤝' },
  { href: '/admin/settings', label: 'Configurações', icon: '⚙️' },
  { href: '/dashboard', label: 'Voltar ao Site', icon: '←' },
];

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
}

interface SystemSettings {
  requireApproval: boolean;
  sendWelcomeEmail: boolean;
  allowSelfRegistration: boolean;
  paymentDueDay: number;
  lateFee: number;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'ASCESA - Associação dos Servidores',
    siteDescription: 'Associação dos Servidores do Sicoob',
    contactEmail: 'contato@ascesa.com.br',
    contactPhone: '(31) 3200-0000',
    address: 'Av. João Pessoa, 1234 - Belo Horizonte, MG',
    facebook: 'https://facebook.com/ascesa',
    instagram: 'https://instagram.com/ascesa',
    youtube: 'https://youtube.com/ascesa',
  });
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    requireApproval: true,
    sendWelcomeEmail: true,
    allowSelfRegistration: true,
    paymentDueDay: 10,
    lateFee: 10.0,
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role !== 'ADMIN' && userData.role !== 'DIRECTOR') {
        router.push('/dashboard');
      }
    } else {
      router.push('/login');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Geral', icon: '⚙️' },
    { id: 'contact', label: 'Contato', icon: '📧' },
    { id: 'social', label: 'Redes Sociais', icon: '📱' },
    { id: 'system', label: 'Sistema', icon: '🔧' },
    { id: 'payment', label: 'Pagamentos', icon: '💳' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--primary)] text-white p-6">
        <h2 className="text-xl font-bold mb-8">Painel Admin</h2>
        <nav className="space-y-2">
          {SIDEBAR_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-2 px-4 rounded hover:bg-white/10 ${
                link.href === '/admin/settings' ? 'bg-white/20' : ''
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[var(--gray-50)]">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Configurações</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === tab.id
                  ? 'bg-white border border-b-0 border-[var(--border)] text-[var(--primary)] font-medium'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configure as informações básicas do site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Site</label>
                <Input
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descrição do Site</label>
                <textarea
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg"
                  rows={3}
                  value={siteSettings.siteDescription}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Settings */}
        {activeTab === 'contact' && (
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
              <CardDescription>Configure as informações de contato da associação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email de Contato</label>
                  <Input
                    type="email"
                    value={siteSettings.contactEmail}
                    onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone</label>
                  <Input
                    value={siteSettings.contactPhone}
                    onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Endereço</label>
                <Input
                  value={siteSettings.address}
                  onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Social Settings */}
        {activeTab === 'social' && (
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
              <CardDescription>Configure os links das redes sociais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Facebook</label>
                <Input
                  type="url"
                  value={siteSettings.facebook}
                  onChange={(e) => setSiteSettings({ ...siteSettings, facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Instagram</label>
                <Input
                  type="url"
                  value={siteSettings.instagram}
                  onChange={(e) => setSiteSettings({ ...siteSettings, instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">YouTube</label>
                <Input
                  type="url"
                  value={siteSettings.youtube}
                  onChange={(e) => setSiteSettings({ ...siteSettings, youtube: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Settings */}
        {activeTab === 'system' && (
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>Configure o comportamento do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Aprovação de Associados</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Novos associados precisam de aprovação administrativa
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.requireApproval}
                    onChange={(e) => setSystemSettings({ ...systemSettings, requireApproval: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Email de Boas-vindas</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Enviar email de boas-vindas ao novo associado
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.sendWelcomeEmail}
                    onChange={(e) => setSystemSettings({ ...systemSettings, sendWelcomeEmail: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Auto-cadastro</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Permitir que novos usuários se cadastrem sozinhos
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.allowSelfRegistration}
                    onChange={(e) => setSystemSettings({ ...systemSettings, allowSelfRegistration: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                </label>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Settings */}
        {activeTab === 'payment' && (
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Pagamento</CardTitle>
              <CardDescription>Configure as regras de pagamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Dia de Vencimento</label>
                  <Input
                    type="number"
                    min={1}
                    max={31}
                    value={systemSettings.paymentDueDay}
                    onChange={(e) => setSystemSettings({ ...systemSettings, paymentDueDay: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Multa por Atraso (%)</label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={systemSettings.lateFee}
                    onChange={(e) => setSystemSettings({ ...systemSettings, lateFee: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> As configurações de pagamento afetam diretamente o sistema de cobrança.
                  Altere com cautela.
                </p>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
