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
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';

@ApiTags('Benefits')
@Controller('benefits')
export class BenefitsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os benefícios' })
  async findAll(@Query('category') category?: string, @Query('active') active?: string) {
    const where: any = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (active !== undefined) {
      where.isActive = active === 'true';
    }

    const benefits = await this.prisma.benefit.findMany({
      where,
      include: {
        partner: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return {
      success: true,
      benefits,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar benefício por ID' })
  async findOne(@Param('id') id: string) {
    const benefit = await this.prisma.benefit.findUnique({
      where: { id },
      include: {
        partner: true,
      },
    });

    if (!benefit) {
      return { success: false, message: 'Benefício não encontrado' };
    }

    return {
      success: true,
      benefit,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo benefício' })
  async create(@Body() createBenefitDto: CreateBenefitDto) {
    try {
      // Generate slug from name
      const slug = createBenefitDto.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const benefit = await this.prisma.benefit.create({
        data: {
          name: createBenefitDto.name,
          slug: `${slug}-${Date.now()}`,
          description: createBenefitDto.description,
          terms: createBenefitDto.terms,
          category: createBenefitDto.category,
          partnerName: createBenefitDto.partnerName,
          partnerLogo: createBenefitDto.partnerLogo,
          discount: createBenefitDto.discount,
          image: createBenefitDto.image,
          isActive: createBenefitDto.isActive ?? true,
          isFeatured: createBenefitDto.isFeatured ?? false,
          order: createBenefitDto.order ?? 0,
          partnerId: createBenefitDto.partnerId,
        },
      });

      return {
        success: true,
        benefit,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao criar benefício' };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar benefício' })
  async update(@Param('id') id: string, @Body() updateBenefitDto: UpdateBenefitDto) {
    try {
      const benefit = await this.prisma.benefit.update({
        where: { id },
        data: {
          name: updateBenefitDto.name,
          description: updateBenefitDto.description,
          terms: updateBenefitDto.terms,
          category: updateBenefitDto.category,
          partnerName: updateBenefitDto.partnerName,
          partnerLogo: updateBenefitDto.partnerLogo,
          discount: updateBenefitDto.discount,
          image: updateBenefitDto.image,
          isActive: updateBenefitDto.isActive,
          isFeatured: updateBenefitDto.isFeatured,
          order: updateBenefitDto.order,
          partnerId: updateBenefitDto.partnerId,
        },
      });

      return {
        success: true,
        benefit,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao atualizar benefício' };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir benefício' })
  async remove(@Param('id') id: string) {
    try {
      await this.prisma.benefit.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Benefício excluído com sucesso',
      };
    } catch (error) {
      return { success: false, message: 'Erro ao excluir benefício' };
    }
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alternar status do benefício' })
  async toggleStatus(@Param('id') id: string) {
    try {
      const benefit = await this.prisma.benefit.findUnique({
        where: { id },
      });

      if (!benefit) {
        return { success: false, message: 'Benefício não encontrado' };
      }

      const updated = await this.prisma.benefit.update({
        where: { id },
        data: {
          isActive: !benefit.isActive,
        },
      });

      return {
        success: true,
        benefit: updated,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao alterar status' };
    }
  }

  @Patch(':id/featured')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alternar destaque do benefício' })
  async toggleFeatured(@Param('id') id: string) {
    try {
      const benefit = await this.prisma.benefit.findUnique({
        where: { id },
      });

      if (!benefit) {
        return { success: false, message: 'Benefício não encontrado' };
      }

      const updated = await this.prisma.benefit.update({
        where: { id },
        data: {
          isFeatured: !benefit.isFeatured,
        },
      });

      return {
        success: true,
        benefit: updated,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao alterar destaque' };
    }
  }
}
