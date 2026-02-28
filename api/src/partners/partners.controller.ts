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
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ParceirosService } from './partners.service';
import { CreateParceiroDto } from './dto/create-parceiro.dto';
import { UpdateParceiroDto } from './dto/update-parceiro.dto';

@ApiTags('Parceiros')
@Controller('parceiros')
export class ParceirosController {
  constructor(private readonly parceirosService: ParceirosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os parceiros com paginação' })
  async findAll(
    @Query('categoria') categoria?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    const result = await this.parceirosService.findAll(
      categoria,
      status,
      pageNum,
      limitNum,
    );

    return {
      success: true,
      ...result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar parceiro por ID' })
  async findOne(@Param('id') id: string) {
    const parceiro = await this.parceirosService.findOne(id);

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
    const parceiro = await this.parceirosService.create(createParceiroDto);

    return {
      success: true,
      parceiro,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar parceiro' })
  async update(
    @Param('id') id: string,
    @Body() updateParceiroDto: UpdateParceiroDto,
  ) {
    const parceiro = await this.parceirosService.update(id, updateParceiroDto);

    return {
      success: true,
      parceiro,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir parceiro' })
  async remove(@Param('id') id: string) {
    await this.parceirosService.remove(id);

    return {
      success: true,
      message: 'Parceiro excluído com sucesso',
    };
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alternar status do parceiro' })
  async toggleStatus(@Param('id') id: string) {
    const parceiro = await this.parceirosService.toggleStatus(id);

    return {
      success: true,
      parceiro,
    };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar status do parceiro (ATIVO, INATIVO, PENDENTE)',
  })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const parceiro = await this.parceirosService.updateStatus(id, status);

    return {
      success: true,
      parceiro,
    };
  }
}
