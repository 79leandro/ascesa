import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../prisma';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateBeneficioDto } from './dto/create-beneficio.dto';
import { UpdateBeneficioDto } from './dto/update-beneficio.dto';

@ApiTags('Beneficios')
@Controller('beneficios')
export class BeneficiosController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os benefícios' })
  async findAll(
    @Query('categoria') categoria?: string,
    @Query('ativo') ativo?: string,
  ) {
    const where: Record<string, unknown> = {};

    if (categoria && categoria !== 'all') {
      where.categoria = categoria;
    }

    if (ativo !== undefined) {
      where.ativo = ativo === 'true';
    }

    const beneficios = await this.prisma.beneficio.findMany({
      where,
      include: {
        parceiro: true,
      },
      orderBy: {
        ordem: 'asc',
      },
    });

    return {
      success: true,
      beneficios,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar benefício por ID' })
  async findOne(@Param('id') id: string) {
    const beneficio = await this.prisma.beneficio.findUnique({
      where: { id },
      include: {
        parceiro: true,
      },
    });

    if (!beneficio) {
      return { success: false, message: 'Benefício não encontrado' };
    }

    return {
      success: true,
      beneficio,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo benefício' })
  async create(@Body() createBeneficioDto: CreateBeneficioDto) {
    try {
      // Generate slug from name
      const slug = createBeneficioDto.nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

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

      return {
        success: true,
        beneficio,
      };
    } catch {
      return { success: false, message: 'Erro ao criar benefício' };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar benefício' })
  async update(
    @Param('id') id: string,
    @Body() updateBeneficioDto: UpdateBeneficioDto,
  ) {
    try {
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

      return {
        success: true,
        beneficio,
      };
    } catch {
      return { success: false, message: 'Erro ao atualizar benefício' };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir benefício' })
  async remove(@Param('id') id: string) {
    try {
      await this.prisma.beneficio.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Benefício excluído com sucesso',
      };
    } catch {
      return { success: false, message: 'Erro ao excluir benefício' };
    }
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alternar status do benefício' })
  async toggleStatus(@Param('id') id: string) {
    try {
      const beneficio = await this.prisma.beneficio.findUnique({
        where: { id },
      });

      if (!beneficio) {
        return { success: false, message: 'Benefício não encontrado' };
      }

      const atualizado = await this.prisma.beneficio.update({
        where: { id },
        data: {
          ativo: !beneficio.ativo,
        },
      });

      return {
        success: true,
        beneficio: atualizado,
      };
    } catch {
      return { success: false, message: 'Erro ao alterar status' };
    }
  }

  @Patch(':id/featured')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alternar destaque do benefício' })
  async toggleFeatured(@Param('id') id: string) {
    try {
      const beneficio = await this.prisma.beneficio.findUnique({
        where: { id },
      });

      if (!beneficio) {
        return { success: false, message: 'Benefício não encontrado' };
      }

      const atualizado = await this.prisma.beneficio.update({
        where: { id },
        data: {
          destacado: !beneficio.destacado,
        },
      });

      return {
        success: true,
        beneficio: atualizado,
      };
    } catch {
      return { success: false, message: 'Erro ao alterar destaque' };
    }
  }
}
