interface StatusBadgeProps {
  status: string;
  label?: string;
  onClick?: () => void;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  ATIVO: { color: 'bg-green-100 text-green-800', label: 'Ativo' },
  INATIVO: { color: 'bg-red-100 text-red-800', label: 'Inativo' },
  PENDENTE: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
  ACTIVE: { color: 'bg-green-100 text-green-800', label: 'Ativo' },
  INACTIVE: { color: 'bg-red-100 text-red-800', label: 'Inativo' },
  PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
  APROVADO: { color: 'bg-green-100 text-green-800', label: 'Aprovado' },
  REJEITADO: { color: 'bg-red-100 text-red-800', label: 'Rejeitado' },
  APPROVED: { color: 'bg-green-100 text-green-800', label: 'Aprovado' },
  REJECTED: { color: 'bg-red-100 text-red-800', label: 'Rejeitado' },
  PAGO: { color: 'bg-green-100 text-green-800', label: 'Pago' },
  ATRASADO: { color: 'bg-red-100 text-red-800', label: 'Atrasado' },
  PAID: { color: 'bg-green-100 text-green-800', label: 'Pago' },
  OVERDUE: { color: 'bg-red-100 text-red-800', label: 'Atrasado' },
};

export function StatusBadge({ status, label, onClick }: StatusBadgeProps) {
  const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: label || status };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} ${
        onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
      }`}
      disabled={!onClick}
    >
      {label || config.label}
    </button>
  );
}
