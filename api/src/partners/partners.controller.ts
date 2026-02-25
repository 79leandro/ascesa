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
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@ApiTags('Partners')
@Controller('partners')
export class PartnersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os parceiros' })
  async findAll(@Query('category') category?: string, @Query('status') status?: string) {
    const where: any = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    const partners = await this.prisma.partner.findMany({
      where,
      include: {
        benefits: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      partners,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar parceiro por ID' })
  async findOne(@Param('id') id: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { id },
      include: {
        benefits: true,
      },
    });

    if (!partner) {
      return { success: false, message: 'Parceiro não encontrado' };
    }

    return {
      success: true,
      partner,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo parceiro' })
  async create(@Body() createPartnerDto: CreatePartnerDto) {
    try {
      const partner = await this.prisma.partner.create({
        data: {
          name: createPartnerDto.name,
          corporateName: createPartnerDto.corporateName,
          cnpj: createPartnerDto.cnpj,
          email: createPartnerDto.email,
          phone: createPartnerDto.phone,
          category: createPartnerDto.category,
          discount: createPartnerDto.discount,
          description: createPartnerDto.description,
          logo: createPartnerDto.logo,
          website: createPartnerDto.website,
          status: createPartnerDto.status ?? 'ACTIVE',
          contractStart: createPartnerDto.contractStart,
          contractEnd: createPartnerDto.contractEnd,
          isActive: createPartnerDto.isActive ?? true,
        },
      });

      return {
        success: true,
        partner,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao criar parceiro' };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar parceiro' })
  async update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    try {
      const partner = await this.prisma.partner.update({
        where: { id },
        data: {
          name: updatePartnerDto.name,
          corporateName: updatePartnerDto.corporateName,
          cnpj: updatePartnerDto.cnpj,
          email: updatePartnerDto.email,
          phone: updatePartnerDto.phone,
          category: updatePartnerDto.category,
          discount: updatePartnerDto.discount,
          description: updatePartnerDto.description,
          logo: updatePartnerDto.logo,
          website: updatePartnerDto.website,
          status: updatePartnerDto.status,
          contractStart: updatePartnerDto.contractStart,
          contractEnd: updatePartnerDto.contractEnd,
          isActive: updatePartnerDto.isActive,
        },
      });

      return {
        success: true,
        partner,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao atualizar parceiro' };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir parceiro' })
  async remove(@Param('id') id: string) {
    try {
      await this.prisma.partner.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Parceiro excluído com sucesso',
      };
    } catch (error) {
      return { success: false, message: 'Erro ao excluir parceiro' };
    }
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alternar status do parceiro' })
  async toggleStatus(@Param('id') id: string) {
    try {
      const partner = await this.prisma.partner.findUnique({
        where: { id },
      });

      if (!partner) {
        return { success: false, message: 'Parceiro não encontrado' };
      }

      const updated = await this.prisma.partner.update({
        where: { id },
        data: {
          isActive: !partner.isActive,
          status: partner.isActive ? 'INACTIVE' : 'ACTIVE',
        },
      });

      return {
        success: true,
        partner: updated,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao alterar status' };
    }
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar status do parceiro (ACTIVE, INACTIVE, PENDING)' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    try {
      const partner = await this.prisma.partner.findUnique({
        where: { id },
      });

      if (!partner) {
        return { success: false, message: 'Parceiro não encontrado' };
      }

      const isActive = status === 'ACTIVE';
      const updated = await this.prisma.partner.update({
        where: { id },
        data: {
          status,
          isActive,
        },
      });

      return {
        success: true,
        partner: updated,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao alterar status' };
    }
  }
}
