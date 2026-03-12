import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  label?: string;
  onClick?: () => void;
}

const statusConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  ATIVO: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle, label: 'Ativo' },
  INATIVO: { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle, label: 'Inativo' },
  PENDENTE: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock, label: 'Pendente' },
  ACTIVE: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle, label: 'Ativo' },
  INACTIVE: { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle, label: 'Inativo' },
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock, label: 'Pendente' },
  APROVADO: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle, label: 'Aprovado' },
  REJEITADO: { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle, label: 'Rejeitado' },
  APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle, label: 'Aprovado' },
  REJECTED: { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle, label: 'Rejeitado' },
  PAGO: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle, label: 'Pago' },
  ATRASADO: { bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle, label: 'Atrasado' },
  PAID: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle, label: 'Pago' },
  OVERDUE: { bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle, label: 'Atrasado' },
};

export function StatusBadge({ status, label, onClick }: StatusBadgeProps) {
  const config = statusConfig[status] || { bg: 'bg-gray-50', text: 'text-gray-700', icon: Clock, label: label || status };
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} ${
        onClick ? 'cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200' : 'cursor-default'
      }`}
      disabled={!onClick}
    >
      <Icon className="w-3.5 h-3.5" />
      {label || config.label}
    </button>
  );
}
