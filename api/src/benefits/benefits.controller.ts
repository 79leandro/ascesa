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
import { BeneficiosService } from './benefits.service';
import { CreateBeneficioDto } from './dto/create-beneficio.dto';
import { UpdateBeneficioDto } from './dto/update-beneficio.dto';

@ApiTags('Beneficios')
@Controller('beneficios')
export class BeneficiosController {
  constructor(private readonly beneficiosService: BeneficiosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os benefícios com paginação' })
  async findAll(
    @Query('categoria') categoria?: string,
    @Query('ativo') ativo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    const result = await this.beneficiosService.findAll(
      categoria,
      ativo,
      pageNum,
      limitNum,
    );

    return {
      success: true,
      ...result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar benefício por ID' })
  async findOne(@Param('id') id: string) {
    const beneficio = await this.beneficiosService.findOne(id);

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
    const beneficio = await this.beneficiosService.create(createBeneficioDto);

    return {
      success: true,
      beneficio,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar benefício' })
  async update(
    @Param('id') id: string,
    @Body() updateBeneficioDto: UpdateBeneficioDto,
  ) {
    const beneficio = await this.beneficiosService.update(id, updateBeneficioDto);

    return {
      success: true,
      beneficio,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir benefício' })
  async remove(@Param('id') id: string) {
    await this.beneficiosService.remove(id);

    return {
      success: true,
      message: 'Benefício excluído com sucesso',
    };
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alternar status do benefício' })
  async toggleStatus(@Param('id') id: string) {
    const beneficio = await this.beneficiosService.toggleStatus(id);

    return {
      success: true,
      beneficio,
    };
  }

  @Patch(':id/featured')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alternar destaque do benefício' })
  async toggleFeatured(@Param('id') id: string) {
    const beneficio = await this.beneficiosService.toggleFeatured(id);

    return {
      success: true,
      beneficio,
    };
  }
}
