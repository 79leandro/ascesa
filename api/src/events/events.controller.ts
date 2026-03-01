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
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { EventsService } from './events.service';
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
  constructor(private eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os eventos' })
  async findAll(
    @Query('categoria') categoria?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    const result = await this.eventsService.findAll(categoria, pageNum, limitNum);

    return {
      success: true,
      ...result,
    };
  }

  @Get('meus-inscricoes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar minhas inscrições' })
  async findMyRegistrations(@Request() req: JwtRequest) {
    const inscricoes = await this.eventsService.findMyRegistrations(req.user.id);

    return {
      success: true,
      inscricoes,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar evento por ID' })
  async findOne(@Param('id') id: string) {
    const evento = await this.eventsService.findOne(id);

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
    const evento = await this.eventsService.create(createEventoDto);

    return {
      success: true,
      evento,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar evento' })
  async update(
    @Param('id') id: string,
    @Body() updateEventoDto: UpdateEventoDto,
  ) {
    const evento = await this.eventsService.update(id, updateEventoDto);

    return {
      success: true,
      evento,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir evento' })
  async remove(@Param('id') id: string) {
    await this.eventsService.remove(id);

    return {
      success: true,
      message: 'Evento excluído com sucesso',
    };
  }

  @Post(':id/inscrever')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Inscrever-se em um evento' })
  async register(@Param('id') id: string, @Request() req: JwtRequest) {
    const evento = await this.eventsService.findOne(id);

    if (!evento.ativo) {
      return { success: false, message: 'Evento inativo' };
    }

    if (evento.vagas > 0 && evento.inscricoes.length >= evento.vagas) {
      return { success: false, message: 'Evento lotado' };
    }

    const inscricao = await this.eventsService.subscribe(
      id,
      req.user.id,
      req.user.nome,
      req.user.email,
    );

    return {
      success: true,
      inscricao,
      message: 'Inscrição realizada com sucesso',
    };
  }

  @Delete(':id/cancelar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar inscrição em um evento' })
  async cancelRegistration(
    @Param('id') id: string,
    @Request() req: JwtRequest,
  ) {
    await this.eventsService.unsubscribe(id, req.user.id);

    return {
      success: true,
      message: 'Inscrição cancelada com sucesso',
    };
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
