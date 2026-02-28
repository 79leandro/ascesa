import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateParceiroDto } from './dto/create-parceiro.dto';
import { UpdateParceiroDto } from './dto/update-parceiro.dto';

@Injectable()
export class ParceirosService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    categoria?: string,
    status?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const where: Record<string, unknown> = {};

    if (categoria && categoria !== 'all') {
      where.categoria = categoria;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [parceiros, total] = await Promise.all([
      this.prisma.parceiro.findMany({
        where,
        include: {
          beneficios: true,
        },
        orderBy: {
          criadoEm: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.parceiro.count({ where }),
    ]);

    return {
      data: parceiros,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const parceiro = await this.prisma.parceiro.findUnique({
      where: { id },
      include: {
        beneficios: true,
      },
    });

    if (!parceiro) {
      throw new NotFoundException('Parceiro não encontrado');
    }

    return parceiro;
  }

  async create(createParceiroDto: CreateParceiroDto) {
    const parceiro = await this.prisma.parceiro.create({
      data: {
        nome: createParceiroDto.nome,
        razaoSocial: createParceiroDto.razaoSocial,
        cnpj: createParceiroDto.cnpj,
        email: createParceiroDto.email,
        telefone: createParceiroDto.telefone,
        categoria: createParceiroDto.categoria,
        desconto: createParceiroDto.desconto,
        descricao: createParceiroDto.descricao,
        logo: createParceiroDto.logo,
        site: createParceiroDto.site,
        status: createParceiroDto.status ?? 'ATIVO',
        inicioContrato: createParceiroDto.inicioContrato,
        fimContrato: createParceiroDto.fimContrato,
        ativo: createParceiroDto.ativo ?? true,
      },
    });

    return parceiro;
  }

  async update(id: string, updateParceiroDto: UpdateParceiroDto) {
    const existing = await this.prisma.parceiro.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Parceiro não encontrado');
    }

    const parceiro = await this.prisma.parceiro.update({
      where: { id },
      data: {
        nome: updateParceiroDto.nome,
        razaoSocial: updateParceiroDto.razaoSocial,
        cnpj: updateParceiroDto.cnpj,
        email: updateParceiroDto.email,
        telefone: updateParceiroDto.telefone,
        categoria: updateParceiroDto.categoria,
        desconto: updateParceiroDto.desconto,
        descricao: updateParceiroDto.descricao,
        logo: updateParceiroDto.logo,
        site: updateParceiroDto.site,
        status: updateParceiroDto.status,
        inicioContrato: updateParceiroDto.inicioContrato,
        fimContrato: updateParceiroDto.fimContrato,
        ativo: updateParceiroDto.ativo,
      },
    });

    return parceiro;
  }

  async remove(id: string) {
    const existing = await this.prisma.parceiro.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Parceiro não encontrado');
    }

    await this.prisma.parceiro.delete({
      where: { id },
    });
  }

  async toggleStatus(id: string) {
    const parceiro = await this.prisma.parceiro.findUnique({
      where: { id },
    });

    if (!parceiro) {
      throw new NotFoundException('Parceiro não encontrado');
    }

    const atualizado = await this.prisma.parceiro.update({
      where: { id },
      data: {
        ativo: !parceiro.ativo,
        status: parceiro.ativo ? 'INATIVO' : 'ATIVO',
      },
    });

    return atualizado;
  }

  async updateStatus(id: string, status: string) {
    const parceiro = await this.prisma.parceiro.findUnique({
      where: { id },
    });

    if (!parceiro) {
      throw new NotFoundException('Parceiro não encontrado');
    }

    const ativo = status === 'ATIVO';
    const atualizado = await this.prisma.parceiro.update({
      where: { id },
      data: {
        status,
        ativo,
      },
    });

    return atualizado;
  }
}
