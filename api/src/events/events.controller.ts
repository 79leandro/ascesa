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

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os eventos' })
  async findAll(@Query('categoria') categoria?: string) {
    const where: any = { ativo: true };

    if (categoria && categoria !== 'all') {
      where.categoria = categoria;
    }

    const eventos = await this.prisma.evento.findMany({
      where,
      include: {
        inscricoes: true,
      },
      orderBy: {
        data: 'asc',
      },
    });

    return {
      success: true,
      eventos,
    };
  }

  @Get('meus-inscricoes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar minhas inscrições' })
  async findMyRegistrations(@Request() req: any) {
    const inscricoes = await this.prisma.inscricaoEvento.findMany({
      where: { usuarioId: req.user.id },
      include: {
        evento: true,
      },
    });

    return {
      success: true,
      inscricoes,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar evento por ID' })
  async findOne(@Param('id') id: string) {
    const evento = await this.prisma.evento.findUnique({
      where: { id },
      include: {
        inscricoes: true,
      },
    });

    if (!evento) {
      return { success: false, message: 'Evento não encontrado' };
    }

    return {
      success: true,
      evento,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo evento' })
  async create(@Body() body: any) {
    try {
      const evento = await this.prisma.evento.create({
        data: {
          titulo: body.titulo,
          descricao: body.descricao,
          data: new Date(body.data),
          horaInicio: body.horaInicio,
          horaFim: body.horaFim,
          local: body.local,
          categoria: body.categoria,
          online: body.online || false,
          preco: parseFloat(body.preco) || 0,
          vagas: parseInt(body.vagas) || 0,
          imagem: body.imagem,
          ativo: true,
        },
      });

      return {
        success: true,
        evento,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao criar evento' };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar evento' })
  async update(@Param('id') id: string, @Body() body: any) {
    try {
      const evento = await this.prisma.evento.update({
        where: { id },
        data: {
          titulo: body.titulo,
          descricao: body.descricao,
          data: body.data ? new Date(body.data) : undefined,
          horaInicio: body.horaInicio,
          horaFim: body.horaFim,
          local: body.local,
          categoria: body.categoria,
          online: body.online,
          preco: body.preco ? parseFloat(body.preco) : undefined,
          vagas: body.vagas ? parseInt(body.vagas) : undefined,
          imagem: body.imagem,
          ativo: body.ativo,
        },
      });

      return {
        success: true,
        evento,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao atualizar evento' };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir evento' })
  async remove(@Param('id') id: string) {
    try {
      await this.prisma.evento.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Evento excluído com sucesso',
      };
    } catch (error) {
      return { success: false, message: 'Erro ao excluir evento' };
    }
  }

  @Post(':id/inscrever')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Inscrever-se em um evento' })
  async register(@Param('id') id: string, @Request() req: any) {
    try {
      const evento = await this.prisma.evento.findUnique({
        where: { id },
        include: {
          inscricoes: true,
        },
      });

      if (!evento) {
        return { success: false, message: 'Evento não encontrado' };
      }

      if (!evento.ativo) {
        return { success: false, message: 'Evento inativo' };
      }

      // Verificar se já está inscrito
      const jaInscrito = evento.inscricoes.some(
        (i) => i.usuarioId === req.user.id,
      );

      if (jaInscrito) {
        return { success: false, message: 'Já inscrito neste evento' };
      }

      // Verificar vagas
      if (evento.vagas > 0 && evento.inscricoes.length >= evento.vagas) {
        return { success: false, message: 'Evento lotado' };
      }

      const inscricao = await this.prisma.inscricaoEvento.create({
        data: {
          eventoId: id,
          usuarioId: req.user.id,
          nome: req.user.nome,
          email: req.user.email,
        },
      });

      return {
        success: true,
        inscricao,
        message: 'Inscrição realizada com sucesso',
      };
    } catch (error) {
      return { success: false, message: 'Erro ao se inscrever' };
    }
  }

  @Delete(':id/cancelar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar inscrição em um evento' })
  async cancelRegistration(@Param('id') id: string, @Request() req: any) {
    try {
      const inscricao = await this.prisma.inscricaoEvento.findFirst({
        where: {
          eventoId: id,
          usuarioId: req.user.id,
        },
      });

      if (!inscricao) {
        return { success: false, message: 'Inscrição não encontrada' };
      }

      await this.prisma.inscricaoEvento.delete({
        where: { id: inscricao.id },
      });

      return {
        success: true,
        message: 'Inscrição cancelada com sucesso',
      };
    } catch (error) {
      return { success: false, message: 'Erro ao cancelar inscrição' };
    }
  }

  @Get('categorias/list')
  @ApiOperation({ summary: 'Listar categorias disponíveis' })
  async getCategories() {
    const categorias = ['Assembleia', 'Workshop', 'Palestra', 'Social', 'Webinar'];

    return {
      success: true,
      categorias,
    };
  }
}
