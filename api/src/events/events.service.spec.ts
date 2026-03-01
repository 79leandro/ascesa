import { NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';

// Mock do PrismaService
const mockPrisma = {
  evento: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  inscricaoEvento: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
};

// Criar instância do serviço com mock
const service = new EventsService(mockPrisma as any);

const mockEvento = {
  id: '123',
  titulo: 'Palestra Teste',
  descricao: 'Descrição do evento',
  data: new Date('2024-12-25'),
  horaInicio: '19:00',
  horaFim: '21:00',
  local: 'Auditório',
  categoria: 'Palestra',
  online: false,
  preco: 0,
  vagas: 50,
  ativo: true,
  inscricoes: [],
};

describe('EventsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated events', async () => {
      mockPrisma.evento.findMany.mockResolvedValue([mockEvento]);
      mockPrisma.evento.count.mockResolvedValue(1);

      const result = await service.findAll();

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by category', async () => {
      mockPrisma.evento.findMany.mockResolvedValue([mockEvento]);
      mockPrisma.evento.count.mockResolvedValue(1);

      await service.findAll('Palestra');

      expect(mockPrisma.evento.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ categoria: 'Palestra' }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return an event by id', async () => {
      mockPrisma.evento.findUnique.mockResolvedValue(mockEvento);

      const result = await service.findOne('123');

      expect(result).toEqual(mockEvento);
    });

    it('should throw NotFoundException when event not found', async () => {
      mockPrisma.evento.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new event', async () => {
      mockPrisma.evento.create.mockResolvedValue(mockEvento);

      const result = await service.create({
        titulo: 'Palestra Teste',
        descricao: 'Descrição',
        data: '2024-12-25',
        horaInicio: '19:00',
        horaFim: '21:00',
        local: 'Auditório',
        categoria: 'Palestra',
      } as any);

      expect(result).toEqual(mockEvento);
    });
  });

  describe('subscribe', () => {
    it('should subscribe user to event', async () => {
      mockPrisma.evento.findUnique.mockResolvedValue(mockEvento);
      mockPrisma.inscricaoEvento.findUnique.mockResolvedValue(null);
      mockPrisma.inscricaoEvento.create.mockResolvedValue({
        id: 'insc-1',
        eventoId: '123',
        usuarioId: 'user-1',
        nome: 'João',
        email: 'joao@teste.com',
      });

      const result = await service.subscribe('123', 'user-1', 'João', 'joao@teste.com');

      expect(result).toBeDefined();
    });

    it('should throw if already subscribed', async () => {
      mockPrisma.evento.findUnique.mockResolvedValue(mockEvento);
      mockPrisma.inscricaoEvento.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(
        service.subscribe('123', 'user-1', 'João', 'joao@teste.com'),
      ).rejects.toThrow('Já inscrito neste evento');
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe user from event', async () => {
      mockPrisma.inscricaoEvento.findUnique.mockResolvedValue({ id: 'insc-1' });
      mockPrisma.inscricaoEvento.delete.mockResolvedValue({});

      await expect(service.unsubscribe('123', 'user-1')).resolves.not.toThrow();
    });

    it('should throw NotFoundException when subscription not found', async () => {
      mockPrisma.inscricaoEvento.findUnique.mockResolvedValue(null);

      await expect(service.unsubscribe('123', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
