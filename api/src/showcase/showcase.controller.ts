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

@ApiTags('Showcase')
@Controller('showcase')
export class ShowcaseController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  async findAll(@Query('categoria') categoria?: string, @Query('ativo') ativo?: string) {
    const where: any = { ativo: true };

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
  async findMyProducts(@Request() req: any) {
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
  async create(@Body() body: any, @Request() req: any) {
    try {
      const produto = await this.prisma.produto.create({
        data: {
          nome: body.nome,
          descricao: body.descricao,
          preco: parseFloat(body.preco),
          precoOriginal: body.precoOriginal ? parseFloat(body.precoOriginal) : null,
          categoria: body.categoria,
          imagens: body.imagens || [],
          vendedor: req.user.nome,
          contatoVendedor: body.contatoVendedor,
          condicao: body.condicao || 'USADO',
          usuarioId: req.user.id,
        },
      });

      return {
        success: true,
        produto,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao criar produto' };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar produto' })
  async update(@Param('id') id: string, @Body() body: any) {
    try {
      const produto = await this.prisma.produto.update({
        where: { id },
        data: {
          nome: body.nome,
          descricao: body.descricao,
          preco: body.preco ? parseFloat(body.preco) : undefined,
          precoOriginal: body.precoOriginal ? parseFloat(body.precoOriginal) : undefined,
          categoria: body.categoria,
          imagens: body.imagens,
          condicao: body.condicao,
          ativo: body.ativo,
        },
      });

      return {
        success: true,
        produto,
      };
    } catch (error) {
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
    } catch (error) {
      return { success: false, message: 'Erro ao excluir produto' };
    }
  }

  @Get('categorias/list')
  @ApiOperation({ summary: 'Listar categorias disponíveis' })
  async getCategories() {
    const categorias = [
      'Eletrônicos',
      'Móveis',
      'Esportes',
      'Livros',
      'Veículos',
      'Roupas',
      'Outros',
    ];

    return {
      success: true,
      categorias,
    };
  }
}
