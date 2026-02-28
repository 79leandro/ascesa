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
import { CreateParceiroDto } from './dto/create-parceiro.dto';
import { UpdateParceiroDto } from './dto/update-parceiro.dto';

@ApiTags('Parceiros')
@Controller('parceiros')
export class ParceirosController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os parceiros' })
  async findAll(
    @Query('categoria') categoria?: string,
    @Query('status') status?: string,
  ) {
    const where: Record<string, unknown> = {};

    if (categoria && categoria !== 'all') {
      where.categoria = categoria;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    const parceiros = await this.prisma.parceiro.findMany({
      where,
      include: {
        beneficios: true,
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });

    return {
      success: true,
      parceiros,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar parceiro por ID' })
  async findOne(@Param('id') id: string) {
    const parceiro = await this.prisma.parceiro.findUnique({
      where: { id },
      include: {
        beneficios: true,
      },
    });

    if (!parceiro) {
      return { success: false, message: 'Parceiro não encontrado' };
    }

    return {
      success: true,
      parceiro,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo parceiro' })
  async create(@Body() createParceiroDto: CreateParceiroDto) {
    try {
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

      return {
        success: true,
        parceiro,
      };
    } catch {
      return { success: false, message: 'Erro ao criar parceiro' };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar parceiro' })
  async update(
    @Param('id') id: string,
    @Body() updateParceiroDto: UpdateParceiroDto,
  ) {
    try {
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

      return {
        success: true,
        parceiro,
      };
    } catch {
      return { success: false, message: 'Erro ao atualizar parceiro' };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir parceiro' })
  async remove(@Param('id') id: string) {
    try {
      await this.prisma.parceiro.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Parceiro excluído com sucesso',
      };
    } catch {
      return { success: false, message: 'Erro ao excluir parceiro' };
    }
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alternar status do parceiro' })
  async toggleStatus(@Param('id') id: string) {
    try {
      const parceiro = await this.prisma.parceiro.findUnique({
        where: { id },
      });

      if (!parceiro) {
        return { success: false, message: 'Parceiro não encontrado' };
      }

      const atualizado = await this.prisma.parceiro.update({
        where: { id },
        data: {
          ativo: !parceiro.ativo,
          status: parceiro.ativo ? 'INATIVO' : 'ATIVO',
        },
      });

      return {
        success: true,
        parceiro: atualizado,
      };
    } catch {
      return { success: false, message: 'Erro ao alterar status' };
    }
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar status do parceiro (ATIVO, INATIVO, PENDENTE)',
  })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    try {
      const parceiro = await this.prisma.parceiro.findUnique({
        where: { id },
      });

      if (!parceiro) {
        return { success: false, message: 'Parceiro não encontrado' };
      }

      const ativo = status === 'ATIVO';
      const atualizado = await this.prisma.parceiro.update({
        where: { id },
        data: {
          status,
          ativo,
        },
      });

      return {
        success: true,
        parceiro: atualizado,
      };
    } catch {
      return { success: false, message: 'Erro ao alterar status' };
    }
  }
}
