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
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

interface JwtRequest {
  user: {
    id: string;
    nome: string;
    email: string;
  };
}

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os eventos' })
  async findAll(@Query('categoria') categoria?: string) {
    const where: { ativo: boolean; categoria?: string } = { ativo: true };

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
  async findMyRegistrations(@Request() req: JwtRequest) {
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
  async create(@Body() createEventoDto: CreateEventoDto) {
    try {
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
          preco: parseFloat(createEventoDto.preco as unknown as string) || 0,
          vagas: parseInt(createEventoDto.vagas as unknown as string) || 0,
          imagem: createEventoDto.imagem,
          ativo: true,
        },
      });

      return {
        success: true,
        evento,
      };
    } catch {
      return { success: false, message: 'Erro ao criar evento' };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar evento' })
  async update(
    @Param('id') id: string,
    @Body() updateEventoDto: UpdateEventoDto,
  ) {
    try {
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
            ? parseFloat(updateEventoDto.preco as unknown as string)
            : undefined,
          vagas: updateEventoDto.vagas
            ? parseInt(updateEventoDto.vagas as unknown as string)
            : undefined,
          imagem: updateEventoDto.imagem,
          ativo: updateEventoDto.ativo,
        },
      });

      return {
        success: true,
        evento,
      };
    } catch {
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
    } catch {
      return { success: false, message: 'Erro ao excluir evento' };
    }
  }

  @Post(':id/inscrever')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Inscrever-se em um evento' })
  async register(@Param('id') id: string, @Request() req: JwtRequest) {
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
    } catch {
      return { success: false, message: 'Erro ao se inscrever' };
    }
  }

  @Delete(':id/cancelar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar inscrição em um evento' })
  async cancelRegistration(
    @Param('id') id: string,
    @Request() req: JwtRequest,
  ) {
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
    } catch {
      return { success: false, message: 'Erro ao cancelar inscrição' };
    }
  }

  @Get('categorias/list')
  @ApiOperation({ summary: 'Listar categorias disponíveis' })
  getCategories() {
    const categorias = [
      'Assembleia',
      'Workshop',
      'Palestra',
      'Social',
      'Webinar',
    ];

    return {
      success: true,
      categorias,
    };
  }
}
