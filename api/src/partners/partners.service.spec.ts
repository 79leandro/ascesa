import { NotFoundException } from '@nestjs/common';
import { ParceirosService } from './partners.service';

// Mock do PrismaService
const mockPrisma = {
  parceiro: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

// Criar instância do serviço com mock
const service = new ParceirosService(mockPrisma as any);

const mockParceiro = {
  id: '123',
  nome: 'Partner Test',
  razaoSocial: 'Partner Test LTDA',
  cnpj: '12345678000100',
  email: 'contato@partner.com',
  telefone: '11999999999',
  categoria: 'Saúde',
  desconto: '20%',
  descricao: 'Descrição do parceiro',
  logo: null,
  site: 'https://partner.com',
  status: 'ATIVO',
  ativo: true,
};

describe('ParceirosService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated partners', async () => {
      mockPrisma.parceiro.findMany.mockResolvedValue([mockParceiro]);
      mockPrisma.parceiro.count.mockResolvedValue(1);

      const result = await service.findAll();

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by category', async () => {
      mockPrisma.parceiro.findMany.mockResolvedValue([mockParceiro]);
      mockPrisma.parceiro.count.mockResolvedValue(1);

      await service.findAll('Saúde');

      expect(mockPrisma.parceiro.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ categoria: 'Saúde' }),
        }),
      );
    });

    it('should filter by status', async () => {
      mockPrisma.parceiro.findMany.mockResolvedValue([mockParceiro]);
      mockPrisma.parceiro.count.mockResolvedValue(1);

      await service.findAll(undefined, 'ATIVO');

      expect(mockPrisma.parceiro.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'ATIVO' }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a partner by id', async () => {
      mockPrisma.parceiro.findUnique.mockResolvedValue(mockParceiro);

      const result = await service.findOne('123');

      expect(result).toEqual(mockParceiro);
    });

    it('should throw NotFoundException when partner not found', async () => {
      mockPrisma.parceiro.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new partner', async () => {
      mockPrisma.parceiro.create.mockResolvedValue(mockParceiro);

      const result = await service.create({
        nome: 'Partner Test',
        razaoSocial: 'Partner Test LTDA',
        cnpj: '12345678000100',
        email: 'contato@partner.com',
        telefone: '11999999999',
        categoria: 'Saúde',
      } as any);

      expect(result).toEqual(mockParceiro);
    });
  });

  describe('toggleStatus', () => {
    it('should toggle partner status to inactive', async () => {
      mockPrisma.parceiro.findUnique.mockResolvedValue(mockParceiro);
      mockPrisma.parceiro.update.mockResolvedValue({
        ...mockParceiro,
        ativo: false,
        status: 'INATIVO',
      });

      const result = await service.toggleStatus('123');

      expect(result.ativo).toBe(false);
      expect(result.status).toBe('INATIVO');
    });

    it('should throw NotFoundException when partner not found', async () => {
      mockPrisma.parceiro.findUnique.mockResolvedValue(null);

      await expect(service.toggleStatus('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update partner status', async () => {
      mockPrisma.parceiro.findUnique.mockResolvedValue(mockParceiro);
      mockPrisma.parceiro.update.mockResolvedValue({
        ...mockParceiro,
        status: 'PENDENTE',
        ativo: false,
      });

      const result = await service.updateStatus('123', 'PENDENTE');

      expect(result.status).toBe('PENDENTE');
      expect(result.ativo).toBe(false);
    });
  });
});
