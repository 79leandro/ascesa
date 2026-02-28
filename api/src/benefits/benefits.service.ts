import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateBeneficioDto } from './dto/create-beneficio.dto';
import { UpdateBeneficioDto } from './dto/update-beneficio.dto';

@Injectable()
export class BeneficiosService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(nome: string): string {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async findAll(
    categoria?: string,
    ativo?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const where: Record<string, unknown> = {};

    if (categoria && categoria !== 'all') {
      where.categoria = categoria;
    }

    if (ativo !== undefined) {
      where.ativo = ativo === 'true';
    }

    const skip = (page - 1) * limit;

    const [beneficios, total] = await Promise.all([
      this.prisma.beneficio.findMany({
        where,
        include: {
          parceiro: true,
        },
        orderBy: {
          ordem: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.beneficio.count({ where }),
    ]);

    return {
      data: beneficios,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const beneficio = await this.prisma.beneficio.findUnique({
      where: { id },
      include: {
        parceiro: true,
      },
    });

    if (!beneficio) {
      throw new NotFoundException('Benefício não encontrado');
    }

    return beneficio;
  }

  async create(createBeneficioDto: CreateBeneficioDto) {
    const slug = this.generateSlug(createBeneficioDto.nome);

    const beneficio = await this.prisma.beneficio.create({
      data: {
        nome: createBeneficioDto.nome,
        slug: `${slug}-${Date.now()}`,
        descricao: createBeneficioDto.descricao,
        termos: createBeneficioDto.termos,
        categoria: createBeneficioDto.categoria,
        nomeParceiro: createBeneficioDto.nomeParceiro,
        logoParceiro: createBeneficioDto.logoParceiro,
        desconto: createBeneficioDto.desconto,
        imagem: createBeneficioDto.imagem,
        ativo: createBeneficioDto.ativo ?? true,
        destacado: createBeneficioDto.destacado ?? false,
        ordem: createBeneficioDto.ordem ?? 0,
        parceiroId: createBeneficioDto.parceiroId,
      },
    });

    return beneficio;
  }

  async update(id: string, updateBeneficioDto: UpdateBeneficioDto) {
    const existing = await this.prisma.beneficio.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Benefício não encontrado');
    }

    const beneficio = await this.prisma.beneficio.update({
      where: { id },
      data: {
        nome: updateBeneficioDto.nome,
        descricao: updateBeneficioDto.descricao,
        termos: updateBeneficioDto.termos,
        categoria: updateBeneficioDto.categoria,
        nomeParceiro: updateBeneficioDto.nomeParceiro,
        logoParceiro: updateBeneficioDto.logoParceiro,
        desconto: updateBeneficioDto.desconto,
        imagem: updateBeneficioDto.imagem,
        ativo: updateBeneficioDto.ativo,
        destacado: updateBeneficioDto.destacado,
        ordem: updateBeneficioDto.ordem,
        parceiroId: updateBeneficioDto.parceiroId,
      },
    });

    return beneficio;
  }

  async remove(id: string) {
    const existing = await this.prisma.beneficio.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Benefício não encontrado');
    }

    await this.prisma.beneficio.delete({
      where: { id },
    });
  }

  async toggleStatus(id: string) {
    const beneficio = await this.prisma.beneficio.findUnique({
      where: { id },
    });

    if (!beneficio) {
      throw new NotFoundException('Benefício não encontrado');
    }

    const atualizado = await this.prisma.beneficio.update({
      where: { id },
      data: {
        ativo: !beneficio.ativo,
      },
    });

    return atualizado;
  }

  async toggleFeatured(id: string) {
    const beneficio = await this.prisma.beneficio.findUnique({
      where: { id },
    });

    if (!beneficio) {
      throw new NotFoundException('Benefício não encontrado');
    }

    const atualizado = await this.prisma.beneficio.update({
      where: { id },
      data: {
        destacado: !beneficio.destacado,
      },
    });

    return atualizado;
  }
}
