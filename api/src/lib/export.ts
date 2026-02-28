// Export utilities for CSV and Excel
import * as XLSX from 'xlsx';

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  filename: string;
  sheetName?: string;
}

/**
 * Convert data to CSV format
 */
export function toCSV(data: ExportData): string {
  const { headers, rows } = data;

  // Create header row
  const csvRows = [headers.join(',')];

  // Add data rows
  for (const row of rows) {
    const escapedRow = row.map(cell => {
      const str = String(cell);
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
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
 * Convert data to Excel format (buffer)
 */
export function toExcel(data: ExportData): Buffer {
  const { headers, rows, sheetName = 'Dados' } = data;

  // Create worksheet data
  const wsData = [headers, ...rows];

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Write to buffer
  return Buffer.from(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
}

/**
 * Generate CSV response for HTTP
 */
export function generateCSVResponse(data: ExportData): Response {
  const csv = toCSV(data);

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8;',
      'Content-Disposition': `attachment; filename="${data.filename}.csv"`,
    },
  });
}

/**
 * Generate Excel response for HTTP
 */
export function generateExcelResponse(data: ExportData): Response {
  const buffer = toExcel(data);

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${data.filename}.xlsx"`,
    },
  });
}

/**
 * Helper to export associates data
 */
export function exportAssociatesData(associates: any[]): ExportData {
  const headers = ['Nome', 'Email', 'CPF', 'Telefone', 'Status', 'Data de Associação', 'Cidade', 'Estado'];
  const rows = associates.map(a => [
    a.usuario?.nome || '',
    a.usuario?.email || '',
    a.cpf || '',
    a.usuario?.telefone || '',
    a.status || '',
    a.dataAssociacao ? new Date(a.dataAssociacao).toLocaleDateString('pt-BR') : '',
    a.cidade || '',
    a.estado || '',
  ]);

  return {
    headers,
    rows,
    filename: `associados_${new Date().toISOString().split('T')[0]}`,
    sheetName: 'Associados',
  };
}

/**
 * Helper to export payments data
 */
export function exportPaymentsData(payments: any[]): ExportData {
  const headers = ['Nome', 'Email', 'Mês', 'Ano', 'Valor', 'Vencimento', 'Pagamento', 'Status'];
  const rows = payments.map(p => [
    p.usuario?.nome || '',
    p.usuario?.email || '',
    p.mes,
    p.ano,
    p.valor,
    p.dataVencimento ? new Date(p.dataVencimento).toLocaleDateString('pt-BR') : '',
    p.dataPagamento ? new Date(p.dataPagamento).toLocaleDateString('pt-BR') : '',
    p.status || '',
  ]);

  return {
    headers,
    rows,
    filename: `pagamentos_${new Date().toISOString().split('T')[0]}`,
    sheetName: 'Pagamentos',
  };
}

/**
 * Helper to export benefits data
 */
export function exportBenefitsData(benefits: any[]): ExportData {
  const headers = ['Nome', 'Categoria', 'Parceiro', 'Desconto', 'Ativo', 'Destacado'];
  const rows = benefits.map(b => [
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
    filename: `beneficios_${new Date().toISOString().split('T')[0]}`,
    sheetName: 'Benefícios',
  };
}
