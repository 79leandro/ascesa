'use client';

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Associados', value: '1.234', icon: '👥' },
            { label: 'Convênios Ativos', value: '52', icon: '🎁' },
            { label: 'Novos este Mês', value: '45', icon: '📈' },
            { label: 'Mensagens', value: '12', icon: '📧' },
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-[var(--border)]">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</div>
              <div className="text-sm text-[var(--muted-foreground)]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Atividades Recentes</h2>
          <div className="space-y-4">
            {[
              { action: 'Novo associado aprovado', time: 'Há 2 minutos' },
              { action: 'Convênio atualizado: Drogaria Popular', time: 'Há 1 hora' },
              { action: 'Nova mensagem de contato', time: 'Há 3 horas' },
              { action: 'Post publicado no blog', time: 'Há 1 dia' },
            ].map((activity, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0">
                <span className="text-[var(--foreground)]">{activity.action}</span>
                <span className="text-sm text-[var(--muted-foreground)]">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
