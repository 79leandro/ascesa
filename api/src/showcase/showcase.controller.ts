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
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../prisma';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

interface JwtRequest {
  user: {
    id: string;
  };
}

interface CreateProductDto {
  nome: string;
  descricao?: string;
  preco: number;
  precoOriginal?: number;
  categoria: string;
  imagens?: string[];
  vendedor: string;
  contatoVendedor: string;
  condicao?: string;
}

interface UpdateProductDto {
  nome?: string;
  descricao?: string;
  preco?: number;
  precoOriginal?: number;
  categoria?: string;
  imagens?: string[];
  ativo?: boolean;
}

@ApiTags('Showcase')
@Controller('showcase')
export class ShowcaseController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  async findAll(
    @Query('categoria') categoria?: string,
    @Query('ativo') ativo?: string,
  ) {
    const where: { ativo: boolean; categoria?: string } = { ativo: true };

    if (categoria && categoria !== 'all') {
      where.categoria = categoria;
    }

    if (ativo !== undefined) {
      where.ativo = ativo === 'true';
    }

    const produtos = await this.prisma.produto.findMany({
      where,
      orderBy: {
        criadoEm: 'desc',
      },
    });

    return {
      success: true,
      produtos,
    };
  }

  @Get('meus-produtos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar meus produtos' })
  async findMyProducts(@Request() req: JwtRequest) {
    const produtos = await this.prisma.produto.findMany({
      where: { usuarioId: req.user.id },
      orderBy: {
        criadoEm: 'desc',
      },
    });

    return {
      success: true,
      produtos,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  async findOne(@Param('id') id: string) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
    });

    if (!produto) {
      return { success: false, message: 'Produto não encontrado' };
    }

    // Incrementar visualizações
    await this.prisma.produto.update({
      where: { id },
      data: { visualizacoes: { increment: 1 } },
    });

    return {
      success: true,
      produto,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo produto' })
  async create(@Body() body: CreateProductDto, @Request() req: JwtRequest) {
    try {
      const produto = await this.prisma.produto.create({
        data: {
          nome: body.nome,
          descricao: body.descricao,
          preco: body.preco,
          precoOriginal: body.precoOriginal,
          categoria: body.categoria,
          imagens: body.imagens || [],
          vendedor: body.vendedor,
          contatoVendedor: body.contatoVendedor,
          condicao:
            (body.condicao as 'NOVO' | 'USADO' | 'REFORMADO') || 'USADO',
          ativo: true,
          usuarioId: req.user.id,
        },
      });

      return {
        success: true,
        produto,
      };
    } catch {
      return { success: false, message: 'Erro ao criar produto' };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar produto' })
  async update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    try {
      const produto = await this.prisma.produto.update({
        where: { id },
        data: {
          nome: body.nome,
          descricao: body.descricao,
          preco: body.preco,
          precoOriginal: body.precoOriginal,
          categoria: body.categoria,
          imagens: body.imagens,
          ativo: body.ativo,
        },
      });

      return {
        success: true,
        produto,
      };
    } catch {
      return { success: false, message: 'Erro ao atualizar produto' };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir produto' })
  async remove(@Param('id') id: string) {
    try {
      await this.prisma.produto.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Produto excluído com sucesso',
      };
    } catch {
      return { success: false, message: 'Erro ao excluir produto' };
    }
  }
}
