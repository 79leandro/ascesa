import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(categoria?: string, page: number = 1, limit: number = 10) {
    const where: { ativo: boolean; categoria?: string } = { ativo: true };

    if (categoria && categoria !== 'all') {
      where.categoria = categoria;
    }

    const skip = (page - 1) * limit;

    const [eventos, total] = await Promise.all([
      this.prisma.evento.findMany({
        where,
        include: {
          inscricoes: true,
        },
        orderBy: {
          data: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.evento.count({ where }),
    ]);

    return {
      data: eventos,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findMyRegistrations(userId: string) {
    const inscricoes = await this.prisma.inscricaoEvento.findMany({
      where: { usuarioId: userId },
      include: {
        evento: true,
      },
    });

    return inscricoes;
  }

  async findOne(id: string) {
    const evento = await this.prisma.evento.findUnique({
      where: { id },
      include: {
        inscricoes: true,
      },
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado');
    }

    return evento;
  }

  async create(createEventoDto: CreateEventoDto) {
    const evento = await this.prisma.evento.create({
      data: {
        titulo: createEventoDto.titulo,
        descricao: createEventoDto.descricao,
        data: new Date(createEventoDto.data),
        horaInicio: createEventoDto.horaInicio,
        horaFim: createEventoDto.horaFim,
        local: createEventoDto.local,
        categoria: createEventoDto.categoria,
        online: createEventoDto.online || false,
        preco: parseFloat(String(createEventoDto.preco)) || 0,
        vagas: parseInt(String(createEventoDto.vagas)) || 0,
        imagem: createEventoDto.imagem,
        ativo: true,
      },
    });

    return evento;
  }

  async update(id: string, updateEventoDto: UpdateEventoDto) {
    const existing = await this.prisma.evento.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Evento não encontrado');
    }

    const evento = await this.prisma.evento.update({
      where: { id },
      data: {
        titulo: updateEventoDto.titulo,
        descricao: updateEventoDto.descricao,
        data: updateEventoDto.data
          ? new Date(updateEventoDto.data)
          : undefined,
        horaInicio: updateEventoDto.horaInicio,
        horaFim: updateEventoDto.horaFim,
        local: updateEventoDto.local,
        categoria: updateEventoDto.categoria,
        online: updateEventoDto.online,
        preco: updateEventoDto.preco
          ? parseFloat(String(updateEventoDto.preco))
          : undefined,
        vagas: updateEventoDto.vagas
          ? parseInt(String(updateEventoDto.vagas))
          : undefined,
        imagem: updateEventoDto.imagem,
        ativo: updateEventoDto.ativo,
      },
    });

    return evento;
  }

  async remove(id: string) {
    const existing = await this.prisma.evento.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Evento não encontrado');
    }

    await this.prisma.evento.delete({
      where: { id },
    });
  }

  async subscribe(eventoId: string, userId: string, nome: string, email: string) {
    const evento = await this.prisma.evento.findUnique({
      where: { id: eventoId },
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado');
    }

    const existingSubscription = await this.prisma.inscricaoEvento.findUnique({
      where: {
        eventoId_usuarioId: {
          eventoId,
          usuarioId: userId,
        },
      },
    });

    if (existingSubscription) {
      throw new Error('Já inscrito neste evento');
    }

    const inscricao = await this.prisma.inscricaoEvento.create({
      data: {
        eventoId,
        usuarioId: userId,
        nome,
        email,
      },
    });

    return inscricao;
  }

  async unsubscribe(eventoId: string, userId: string) {
    const existingSubscription = await this.prisma.inscricaoEvento.findUnique({
      where: {
        eventoId_usuarioId: {
          eventoId,
          usuarioId: userId,
        },
      },
    });

    if (!existingSubscription) {
      throw new NotFoundException('Inscrição não encontrada');
    }

    await this.prisma.inscricaoEvento.delete({
      where: {
        eventoId_usuarioId: {
          eventoId,
          usuarioId: userId,
        },
      },
    });
  }
}
