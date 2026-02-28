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

@ApiTags('Forum')
@Controller('forum')
export class ForumController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os tópicos' })
  async findAll(@Query('categoria') categoria?: string) {
    const where: any = {};

    if (categoria && categoria !== 'all') {
      where.categoria = categoria;
    }

    const topicos = await this.prisma.topico.findMany({
      where,
      include: {
        respostas: {
          orderBy: { criadoEm: 'desc' },
          take: 1,
        },
        _count: {
          select: { respostas: true },
        },
      },
      orderBy: [
        { fixado: 'desc' },
        { criadoEm: 'desc' },
      ],
    });

    return {
      success: true,
      topicos,
    };
  }

  @Get('categorias/list')
  @ApiOperation({ summary: 'Listar categorias disponíveis' })
  async getCategories() {
    const categorias = ['Geral', 'Benefícios', 'Finanças', 'Eventos', 'Dúvidas', 'Sugestões'];

    return {
      success: true,
      categorias,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tópico por ID' })
  async findOne(@Param('id') id: string) {
    const topico = await this.prisma.topico.findUnique({
      where: { id },
      include: {
        respostas: {
          orderBy: { criadoEm: 'asc' },
        },
      },
    });

    if (!topico) {
      return { success: false, message: 'Tópico não encontrado' };
    }

    // Incrementar visualizações
    await this.prisma.topico.update({
      where: { id },
      data: { visualizacoes: { increment: 1 } },
    });

    return {
      success: true,
      topico,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo tópico' })
  async create(@Body() body: any, @Request() req: any) {
    try {
      const topico = await this.prisma.topico.create({
        data: {
          titulo: body.titulo,
          conteudo: body.conteudo,
          categoria: body.categoria,
          autor: req.user.nome,
          usuarioId: req.user.id,
        },
      });

      return {
        success: true,
        topico,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao criar tópico' };
    }
  }

  @Post(':id/respostas')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar resposta a um tópico' })
  async createReply(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    try {
      const topico = await this.prisma.topico.findUnique({ where: { id } });

      if (!topico) {
        return { success: false, message: 'Tópico não encontrado' };
      }

      if (topico.fechado) {
        return { success: false, message: 'Tópico está fechado' };
      }

      const resposta = await this.prisma.resposta.create({
        data: {
          topicoId: id,
          conteudo: body.conteudo,
          autor: req.user.nome,
          usuarioId: req.user.id,
        },
      });

      return {
        success: true,
        resposta,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao criar resposta' };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar tópico (apenas autor ou admin)' })
  async update(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    try {
      const topico = await this.prisma.topico.findUnique({ where: { id } });

      if (!topico) {
        return { success: false, message: 'Tópico não encontrado' };
      }

      // Verificar se é autor ou admin
      const isAuthor = topico.usuarioId === req.user.id;
      const isAdmin = req.user.papel === 'ADMIN' || req.user.papel === 'DIRETOR';

      if (!isAuthor && !isAdmin) {
        return { success: false, message: 'Sem permissão' };
      }

      const atualizado = await this.prisma.topico.update({
        where: { id },
        data: {
          titulo: body.titulo,
          conteudo: body.conteudo,
          categoria: body.categoria,
          fixado: body.fixado,
          fechado: body.fechado,
        },
      });

      return {
        success: true,
        topico: atualizado,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao atualizar tópico' };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir tópico (apenas autor ou admin)' })
  async remove(@Param('id') id: string, @Request() req: any) {
    try {
      const topico = await this.prisma.topico.findUnique({ where: { id } });

      if (!topico) {
        return { success: false, message: 'Tópico não encontrado' };
      }

      const isAuthor = topico.usuarioId === req.user.id;
      const isAdmin = req.user.papel === 'ADMIN' || req.user.papel === 'DIRETOR';

      if (!isAuthor && !isAdmin) {
        return { success: false, message: 'Sem permissão' };
      }

      await this.prisma.topico.delete({ where: { id } });

      return {
        success: true,
        message: 'Tópico excluído com sucesso',
      };
    } catch (error) {
      return { success: false, message: 'Erro ao excluir tópico' };
    }
  }

  @Delete('respostas/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir resposta' })
  async removeReply(@Param('id') id: string, @Request() req: any) {
    try {
      const resposta = await this.prisma.resposta.findUnique({ where: { id } });

      if (!resposta) {
        return { success: false, message: 'Resposta não encontrada' };
      }

      const isAuthor = resposta.usuarioId === req.user.id;
      const isAdmin = req.user.papel === 'ADMIN' || req.user.papel === 'DIRETOR';

      if (!isAuthor && !isAdmin) {
        return { success: false, message: 'Sem permissão' };
      }

      await this.prisma.resposta.delete({ where: { id } });

      return {
        success: true,
        message: 'Resposta excluída com sucesso',
      };
    } catch (error) {
      return { success: false, message: 'Erro ao excluir resposta' };
    }
  }
}
