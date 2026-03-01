import { AssembliesService } from './assemblies.service';

// Mock PrismaService
const mockPrisma = {
  assembleia: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  candidato: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  voto: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const service = new AssembliesService(mockPrisma as any);

const mockAssembly = {
  id: 'assembly-1',
  titulo: 'Assembleia Teste',
  tipo: 'ORDINARIA',
  data: new Date('2024-12-31'),
  hora: '19:00',
  local: 'Sede',
  descricao: 'Descrição',
  status: 'AGENDADA',
  totalVotos: 0,
};

const mockCandidate = {
  id: 'candidate-1',
  assembleiaId: 'assembly-1',
  nome: 'Candidato 1',
  cargo: 'Diretor',
  votos: 0,
};

describe('AssembliesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated assemblies', async () => {
      mockPrisma.assembleia.findMany.mockResolvedValue([mockAssembly]);
      mockPrisma.assembleia.count.mockResolvedValue(1);

      const result = await service.findAll();

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findActive', () => {
    it('should return active assemblies', async () => {
      mockPrisma.assembleia.findMany.mockResolvedValue([mockAssembly]);

      const result = await service.findActive();

      expect(result).toHaveLength(1);
      expect(mockPrisma.assembleia.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'EM_ANDAMENTO' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return an assembly by id', async () => {
      mockPrisma.assembleia.findUnique.mockResolvedValue(mockAssembly);

      const result = await service.findOne('assembly-1');

      expect(result).toEqual(mockAssembly);
    });

    it('should throw NotFoundException when assembly not found', async () => {
      mockPrisma.assembleia.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new assembly', async () => {
      mockPrisma.assembleia.create.mockResolvedValue(mockAssembly);

      const result = await service.create({
        titulo: 'Assembleia Teste',
        tipo: 'ORDINARIA',
        data: '2024-12-31',
        hora: '19:00',
        local: 'Sede',
      });

      expect(result).toEqual(mockAssembly);
    });
  });

  describe('update', () => {
    it('should update an assembly', async () => {
      mockPrisma.assembleia.findUnique.mockResolvedValue(mockAssembly);
      mockPrisma.assembleia.update.mockResolvedValue({
        ...mockAssembly,
        titulo: 'Updated Title',
      });

      const result = await service.update('assembly-1', {
        titulo: 'Updated Title',
      });

      expect(result.titulo).toBe('Updated Title');
    });

    it('should throw NotFoundException when assembly not found', async () => {
      mockPrisma.assembleia.findUnique.mockResolvedValue(null);

      await expect(
        service.update('invalid', { titulo: 'Test' }),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete an assembly', async () => {
      mockPrisma.assembleia.findUnique.mockResolvedValue(mockAssembly);
      mockPrisma.assembleia.delete.mockResolvedValue({});

      await expect(service.remove('assembly-1')).resolves.not.toThrow();
    });

    it('should throw NotFoundException when assembly not found', async () => {
      mockPrisma.assembleia.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid')).rejects.toThrow();
    });
  });

  describe('addCandidate', () => {
    it('should add a candidate to assembly', async () => {
      mockPrisma.assembleia.findUnique.mockResolvedValue(mockAssembly);
      mockPrisma.candidato.create.mockResolvedValue(mockCandidate);

      const result = await service.addCandidate('assembly-1', {
        nome: 'Candidato 1',
        cargo: 'Diretor',
      });

      expect(result).toEqual(mockCandidate);
    });

    it('should throw NotFoundException when assembly not found', async () => {
      mockPrisma.assembleia.findUnique.mockResolvedValue(null);

      await expect(
        service.addCandidate('invalid', { nome: 'Test', cargo: 'Cargo' }),
      ).rejects.toThrow();
    });
  });

  describe('vote', () => {
    it('should vote successfully', async () => {
      mockPrisma.assembleia.findUnique.mockResolvedValue({
        ...mockAssembly,
        status: 'EM_ANDAMENTO',
      });
      mockPrisma.voto.findUnique.mockResolvedValue(null);
      mockPrisma.candidato.findUnique.mockResolvedValue(mockCandidate);
      mockPrisma.voto.create.mockResolvedValue({});
      mockPrisma.candidato.update.mockResolvedValue({});
      mockPrisma.assembleia.update.mockResolvedValue({});

      await expect(
        service.vote('assembly-1', 'candidate-1', 'user-1'),
      ).resolves.not.toThrow();
    });

    it('should throw when assembly not found', async () => {
      mockPrisma.assembleia.findUnique.mockResolvedValue(null);

      await expect(
        service.vote('invalid', 'candidate-1', 'user-1'),
      ).rejects.toThrow();
    });

    it('should throw when voting is not open', async () => {
      mockPrisma.assembleia.findUnique.mockResolvedValue({
        ...mockAssembly,
        status: 'ENCERRADA',
      });

      await expect(
        service.vote('assembly-1', 'candidate-1', 'user-1'),
      ).rejects.toThrow('Votação não está aberta');
    });

    it('should throw when user already voted', async () => {
      mockPrisma.assembleia.findUnique.mockResolvedValue({
        ...mockAssembly,
        status: 'EM_ANDAMENTO',
      });
      mockPrisma.voto.findUnique.mockResolvedValue({ id: 'existing-vote' });

      await expect(
        service.vote('assembly-1', 'candidate-1', 'user-1'),
      ).rejects.toThrow('Você já votou nesta Assembleia');
    });
  });
});
