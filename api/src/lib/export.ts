// Utilitários de exportação para CSV e Excel
import * as XLSX from 'xlsx';

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  filename: string;
  sheetName?: string;
}

/**
 * Converte dados para formato CSV
 */
export function toCSV(data: ExportData): string {
  const { headers, rows } = data;

  // Criar linha de cabeçalho
  const csvRows = [headers.join(',')];

  // Adicionar linhas de dados
  for (const row of rows) {
    const escapedRow = row.map((cell) => {
      const str = String(cell);
      // Escapa aspas e envolve em aspas se conter vírgula, aspa ou nova linha
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });
    csvRows.push(escapedRow.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Converte dados para formato Excel (buffer)
 */
export function toExcel(data: ExportData): Buffer {
  const { headers, rows, sheetName = 'Dados' } = data;

  // Criar dados da planilha
  const wsData = [headers, ...rows];

  // Criar workbook e worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Adicionar worksheet ao workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Escrever para buffer
  return Buffer.from(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
}

/**
 * Exporta dados de associados para formato de exportação
 */
export function exportAssociatesData(associates: {
  nome?: string;
  email?: string;
  cpf?: string;
  status?: string;
  dataAssociacao?: Date | string;
}[]): ExportData {
  const headers = ['Nome', 'Email', 'CPF', 'Status', 'Data de Associação'];
  const rows = associates.map((a) => [
    a.nome || '',
    a.email || '',
    a.cpf || '',
    a.status || '',
    a.dataAssociacao
      ? new Date(a.dataAssociacao).toLocaleDateString('pt-BR')
      : '',
  ]);

  return {
    headers,
    rows,
    filename: `associados_${new Date().toISOString().split('T')[0]}.csv`,
    sheetName: 'Associados',
  };
}

/**
 * Exporta dados de pagamentos para formato de exportação
 */
export function exportPaymentsData(payments: {
  mes?: number;
  ano?: number;
  valor?: number;
  status?: string;
  dataPagamento?: Date | string | null;
}[]): ExportData {
  const headers = ['Mês', 'Ano', 'Valor', 'Status', 'Data de Pagamento'];
  const rows = payments.map((p) => [
    p.mes || 0,
    p.ano || 0,
    p.valor || 0,
    p.status || '',
    p.dataPagamento
      ? new Date(p.dataPagamento).toLocaleDateString('pt-BR')
      : '',
  ]);

  return {
    headers,
    rows,
    filename: `pagamentos_${new Date().toISOString().split('T')[0]}.csv`,
    sheetName: 'Pagamentos',
  };
}

/**
 * Exporta dados de benefícios para formato de exportação
 */
export function exportBenefitsData(benefits: {
  nome?: string;
  categoria?: string;
  nomeParceiro?: string | null;
  desconto?: string | null;
  ativo?: boolean;
  destacado?: boolean;
}[]): ExportData {
  const headers = [
    'Nome',
    'Categoria',
    'Parceiro',
    'Desconto',
    'Ativo',
    'Destacado',
  ];
  const rows = benefits.map((b) => [
    b.nome || '',
    b.categoria || '',
    b.nomeParceiro || '',
    b.desconto || '',
    b.ativo ? 'Sim' : 'Não',
    b.destacado ? 'Sim' : 'Não',
  ]);

  return {
    headers,
    rows,
    filename: `beneficios_${new Date().toISOString().split('T')[0]}.csv`,
    sheetName: 'Benefícios',
  };
}
