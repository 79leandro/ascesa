import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

// Mock do PrismaService
const mockPrisma = {
  usuario: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  associado: {
    updateMany: jest.fn(),
  },
};

// Criar instância do serviço com mock
const service = new UsersService(mockPrisma as any);

const mockUsuario = {
  id: '123',
  email: 'test@example.com',
  nome: 'João Silva',
  telefone: '11999999999',
  cpf: '12345678901',
  status: 'ATIVO',
  papel: 'ASSOCIADO',
  associado: null,
};

describe('UsersService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUsuario);

      const result = await service.findOne('123');

      expect(result.id).toBe('123');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update user data', async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUsuario);
      mockPrisma.usuario.update.mockResolvedValue({
        ...mockUsuario,
        nome: 'João Atualizado',
      });

      const result = await service.update('123', { nome: 'João Atualizado' });

      expect(result.nome).toBe('João Atualizado');
    });

    it('should update associated data when provided', async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUsuario);
      mockPrisma.usuario.update.mockResolvedValue(mockUsuario);
      mockPrisma.associado.updateMany.mockResolvedValue({ count: 1 });

      await service.update('123', { profissao: 'Developer', cidade: 'São Paulo' });

      expect(mockPrisma.associado.updateMany).toHaveBeenCalledWith({
        where: { usuarioId: '123' },
        data: { profissao: 'Developer', cidade: 'São Paulo' },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(null);

      await expect(service.update('999', { nome: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
