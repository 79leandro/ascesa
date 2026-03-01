import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';

interface CreateAssemblyDto {
  titulo: string;
  tipo: 'ORDINARIA' | 'EXTRAORDINARIA';
  data: string;
  hora: string;
  local: string;
  descricao?: string;
}

interface UpdateAssemblyDto {
  titulo?: string;
  tipo?: 'ORDINARIA' | 'EXTRAORDINARIA';
  data?: string;
  hora?: string;
  local?: string;
  descricao?: string;
  status?: 'AGENDADA' | 'EM_ANDAMENTO' | 'ENCERRADA' | 'CANCELADA';
}

interface AddCandidateDto {
  nome: string;
  cargo: string;
  foto?: string;
}

interface VoteDto {
  candidatoId: string;
}

@Injectable()
export class AssembliesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [assembleias, total] = await Promise.all([
      this.prisma.assembleia.findMany({
        include: {
          candidatos: true,
        },
        orderBy: {
          data: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.assembleia.count(),
    ]);

    return {
      data: assembleias,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findActive() {
    const assembleias = await this.prisma.assembleia.findMany({
      where: {
        status: 'EM_ANDAMENTO',
      },
      include: {
        candidatos: true,
      },
    });

    return assembleias;
  }

  async findOne(id: string) {
    const assembleia = await this.prisma.assembleia.findUnique({
      where: { id },
      include: {
        candidatos: {
          include: {
            votosList: true,
          },
        },
        votos: true,
      },
    });

    if (!assembleia) {
      throw new NotFoundException('Assembleia não encontrada');
    }

    return assembleia;
  }

  async create(data: CreateAssemblyDto) {
    const assembleia = await this.prisma.assembleia.create({
      data: {
        titulo: data.titulo,
        tipo: data.tipo,
        data: new Date(data.data),
        hora: data.hora,
        local: data.local,
        descricao: data.descricao,
        status: 'AGENDADA',
      },
    });

    return assembleia;
  }

  async update(id: string, data: UpdateAssemblyDto) {
    const existing = await this.prisma.assembleia.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Assembleia não encontrada');
    }

    const assembleia = await this.prisma.assembleia.update({
      where: { id },
      data: {
        titulo: data.titulo,
        tipo: data.tipo,
        data: data.data ? new Date(data.data) : undefined,
        hora: data.hora,
        local: data.local,
        descricao: data.descricao,
        status: data.status,
      },
    });

    return assembleia;
  }

  async remove(id: string) {
    const existing = await this.prisma.assembleia.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Assembleia não encontrada');
    }

    await this.prisma.assembleia.delete({
      where: { id },
    });
  }

  async addCandidate(assemblyId: string, data: AddCandidateDto) {
    const assembleia = await this.prisma.assembleia.findUnique({
      where: { id: assemblyId },
    });

    if (!assembleia) {
      throw new NotFoundException('Assembleia não encontrada');
    }

    const candidato = await this.prisma.candidato.create({
      data: {
        assembleiaId: assemblyId,
        nome: data.nome,
        cargo: data.cargo,
        foto: data.foto,
      },
    });

    return candidato;
  }

  async vote(assemblyId: string, candidateId: string, userId: string) {
    const assembleia = await this.prisma.assembleia.findUnique({
      where: { id: assemblyId },
    });

    if (!assembleia) {
      throw new NotFoundException('Assembleia não encontrada');
    }

    if (assembleia.status !== 'EM_ANDAMENTO') {
      throw new Error('Votação não está aberta');
    }

    const existingVote = await this.prisma.voto.findUnique({
      where: {
        assembleiaId_usuarioId: {
          assembleiaId: assemblyId,
          usuarioId: userId,
        },
      },
    });

    if (existingVote) {
      throw new Error('Você já votou nesta Assembleia');
    }

    const candidato = await this.prisma.candidato.findUnique({
      where: { id: candidateId },
    });

    if (!candidato || candidato.assembleiaId !== assemblyId) {
      throw new NotFoundException('Candidato não encontrado');
    }

    const [, candidatoAtualizado] = await Promise.all([
      this.prisma.voto.create({
        data: {
          assembleiaId: assemblyId,
          candidatoId: candidateId,
          usuarioId: userId,
        },
      }),
      this.prisma.candidato.update({
        where: { id: candidateId },
        data: {
          votos: { increment: 1 },
        },
      }),
      this.prisma.assembleia.update({
        where: { id: assemblyId },
        data: {
          totalVotos: { increment: 1 },
        },
      }),
    ]);

    return candidatoAtualizado;
  }
}
