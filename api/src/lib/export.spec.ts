import {
  toCSV,
  toExcel,
  exportAssociatesData,
  exportPaymentsData,
  exportBenefitsData,
} from './export';

describe('Export Utils', () => {
  describe('toCSV', () => {
    it('should convert simple data to CSV', () => {
      const result = toCSV({
        headers: ['Name', 'Email'],
        rows: [['John', 'john@example.com']],
        filename: 'test.csv',
      });

      expect(result).toContain('Name,Email');
      expect(result).toContain('John,john@example.com');
    });

    it('should escape commas in values', () => {
      const result = toCSV({
        headers: ['Name'],
        rows: [['John, Jr']],
        filename: 'test.csv',
      });

      expect(result).toContain('"John, Jr"');
    });

    it('should escape quotes in values', () => {
      const result = toCSV({
        headers: ['Name'],
        rows: [['John "The Best"']],
        filename: 'test.csv',
      });

      expect(result).toContain('"John ""The Best"""');
    });

    it('should handle empty data', () => {
      const result = toCSV({
        headers: [],
        rows: [],
        filename: 'test.csv',
      });

      expect(result).toBe('');
    });
  });

  describe('toExcel', () => {
    it('should return a Buffer', () => {
      const result = toExcel({
        headers: ['Name', 'Email'],
        rows: [['John', 'john@example.com']],
        filename: 'test.xlsx',
        sheetName: 'Sheet1',
      });

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should use default sheet name', () => {
      const result = toExcel({
        headers: ['Name'],
        rows: [['John']],
        filename: 'test.xlsx',
      });

      expect(result).toBeInstanceOf(Buffer);
    });
  });

  describe('exportAssociatesData', () => {
    it('should export associates data with correct headers', () => {
      const result = exportAssociatesData([
        {
          nome: 'John Doe',
          email: 'john@example.com',
          cpf: '12345678901',
          status: 'ATIVO',
          dataAssociacao: new Date('2024-01-15'),
        },
      ]);

      expect(result.headers).toEqual([
        'Nome',
        'Email',
        'CPF',
        'Status',
        'Data de Associação',
      ]);
      expect(result.filename).toContain('associados_');
      expect(result.sheetName).toBe('Associados');
    });

    it('should handle empty associates', () => {
      const result = exportAssociatesData([]);

      expect(result.rows).toHaveLength(0);
    });

    it('should handle missing fields', () => {
      const result = exportAssociatesData([{}]);

      expect(result.rows[0]).toEqual(['', '', '', '', '']);
    });
  });

  describe('exportPaymentsData', () => {
    it('should export payments data with correct headers', () => {
      const result = exportPaymentsData([
        {
          mes: 1,
          ano: 2024,
          valor: 100.5,
          status: 'PAGO',
          dataPagamento: new Date('2024-01-15'),
        },
      ]);

      expect(result.headers).toEqual([
        'Mês',
        'Ano',
        'Valor',
        'Status',
        'Data de Pagamento',
      ]);
      expect(result.filename).toContain('pagamentos_');
      expect(result.sheetName).toBe('Pagamentos');
    });

    it('should handle empty payments', () => {
      const result = exportPaymentsData([]);

      expect(result.rows).toHaveLength(0);
    });

    it('should handle null dataPagamento', () => {
      const result = exportPaymentsData([
        { mes: 1, ano: 2024, valor: 100, status: 'PENDENTE', dataPagamento: null },
      ]);

      expect(result.rows[0][4]).toBe('');
    });
  });

  describe('exportBenefitsData', () => {
    it('should export benefits data with correct headers', () => {
      const result = exportBenefitsData([
        {
          nome: 'Plano de Saúde',
          categoria: 'Saúde',
          nomeParceiro: 'Partner X',
          desconto: '20%',
          ativo: true,
          destacado: false,
        },
      ]);

      expect(result.headers).toEqual([
        'Nome',
        'Categoria',
        'Parceiro',
        'Desconto',
        'Ativo',
        'Destacado',
      ]);
      expect(result.filename).toContain('beneficios_');
      expect(result.sheetName).toBe('Benefícios');
    });

    it('should translate boolean to Sim/Não', () => {
      const result = exportBenefitsData([
        { nome: 'Test', categoria: 'Cat', ativo: true, destacado: true },
      ]);

      expect(result.rows[0][4]).toBe('Sim');
      expect(result.rows[0][5]).toBe('Sim');
    });
  });
});
