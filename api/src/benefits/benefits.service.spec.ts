import { NotFoundException } from '@nestjs/common';
import { BeneficiosService } from './benefits.service';

// Mock do PrismaService
const mockPrisma = {
  beneficio: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

// Criar instância do serviço com mock
const service = new BeneficiosService(mockPrisma as any);

const mockBeneficio = {
  id: '123',
  nome: 'Plano de Saúde',
  slug: 'plano-de-saude',
  descricao: 'Descrição do benefício',
  categoria: 'Saúde',
  ativo: true,
  destacado: false,
  ordem: 1,
};

describe('BenefitsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated benefits', async () => {
      mockPrisma.beneficio.findMany.mockResolvedValue([mockBeneficio]);
      mockPrisma.beneficio.count.mockResolvedValue(1);

      const result = await service.findAll();

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by category', async () => {
      mockPrisma.beneficio.findMany.mockResolvedValue([mockBeneficio]);
      mockPrisma.beneficio.count.mockResolvedValue(1);

      await service.findAll('Saúde');

      expect(mockPrisma.beneficio.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ categoria: 'Saúde' }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a benefit by id', async () => {
      mockPrisma.beneficio.findUnique.mockResolvedValue(mockBeneficio);

      const result = await service.findOne('123');

      expect(result).toEqual(mockBeneficio);
    });

    it('should throw NotFoundException when benefit not found', async () => {
      mockPrisma.beneficio.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new benefit', async () => {
      mockPrisma.beneficio.create.mockResolvedValue(mockBeneficio);

      const result = await service.create({
        nome: 'Plano de Saúde',
        descricao: 'Descrição',
        categoria: 'Saúde',
      } as any);

      expect(result).toEqual(mockBeneficio);
    });
  });

  describe('toggleStatus', () => {
    it('should toggle benefit status', async () => {
      mockPrisma.beneficio.findUnique.mockResolvedValue(mockBeneficio);
      mockPrisma.beneficio.update.mockResolvedValue({
        ...mockBeneficio,
        ativo: false,
      });

      const result = await service.toggleStatus('123');

      expect(result.ativo).toBe(false);
    });

    it('should throw NotFoundException when benefit not found', async () => {
      mockPrisma.beneficio.findUnique.mockResolvedValue(null);

      await expect(service.toggleStatus('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleFeatured', () => {
    it('should toggle featured status', async () => {
      mockPrisma.beneficio.findUnique.mockResolvedValue(mockBeneficio);
      mockPrisma.beneficio.update.mockResolvedValue({
        ...mockBeneficio,
        destacado: true,
      });

      const result = await service.toggleFeatured('123');

      expect(result.destacado).toBe(true);
    });
  });
});
