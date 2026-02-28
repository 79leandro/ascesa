import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { PrismaService } from '../prisma';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { MailService } from '../mail/mail.service';
import { exportAssociatesData, toCSV, toExcel } from '../lib/export';
import type { Response } from 'express';

interface JwtRequest {
  user: {
    id: string;
  };
}

@ApiTags('Associates')
@Controller('associates')
export class AssociatesController {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  /**
   * Get current user's associate profile
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar perfil do associado atual' })
  async getMyProfile(@Request() req: JwtRequest) {
    const associate = await this.prisma.associado.findFirst({
      where: { usuarioId: req.user.id },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            cpf: true,
            status: true,
            papel: true,
          },
        },
      },
    });

    if (!associate) {
      return { success: false, message: 'Associado não encontrado' };
    }

    return {
      success: true,
      data: associate,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os associados com filtros' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1');
    const limitNum = parseInt(limit || '20');
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};

    if (status && status !== 'ALL') {
      where.usuario = { status: status };
    }

    if (search) {
      where.OR = [
        { usuario: { nome: { contains: search, mode: 'insensitive' } } },
        { usuario: { email: { contains: search, mode: 'insensitive' } } },
        { cpf: { contains: search } },
      ];
    }

    const [associates, total] = await Promise.all([
      this.prisma.associado.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { criadoEm: 'desc' },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true,
              status: true,
              papel: true,
              criadoEm: true,
            },
          },
        },
      }),
      this.prisma.associado.count({ where }),
    ]);

    return {
      success: true,
      data: associates,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter estatísticas de associados' })
  async getStats() {
    const [total, ativos, inativos, pendentes] = await Promise.all([
      this.prisma.usuario.count({ where: { papel: 'ASSOCIADO' } }),
      this.prisma.usuario.count({
        where: { papel: 'ASSOCIADO', status: 'ATIVO' },
      }),
      this.prisma.usuario.count({
        where: { papel: 'ASSOCIADO', status: 'INATIVO' },
      }),
      this.prisma.usuario.count({
        where: { papel: 'ASSOCIADO', status: 'PENDENTE' },
      }),
    ]);

    return {
      success: true,
      stats: {
        total,
        ativos,
        inativos,
        pendentes,
      },
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar associado por ID' })
  async findOne(@Param('id') id: string) {
    const associate = await this.prisma.associado.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            cpf: true,
            status: true,
            papel: true,
            criadoEm: true,
            ultimoLogin: true,
          },
        },
      },
    });

    if (!associate) {
      return { success: false, message: 'Associado não encontrado' };
    }

    return { success: true, data: associate };
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprovar associado' })
  async approve(@Param('id') id: string) {
    try {
      const associate = await this.prisma.associado.findUnique({
        where: { id },
        include: { usuario: true },
      });

      if (!associate) {
        return { success: false, message: 'Associado não encontrado' };
      }

      // Update user and associate status
      await this.prisma.$transaction([
        this.prisma.usuario.update({
          where: { id: associate.usuarioId },
          data: { status: 'ATIVO' },
        }),
        this.prisma.associado.update({
          where: { id },
          data: { status: 'ATIVO' },
        }),
      ]);

      // Send approval email
      await this.mailService.sendApprovalEmail(
        associate.usuario.email,
        associate.usuario.nome,
      );

      return { success: true, message: 'Associado aprovado com sucesso' };
    } catch {
      return { success: false, message: 'Erro ao aprovar associado' };
    }
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rejeitar associado' })
  async reject(@Param('id') id: string, @Body('reason') reason: string) {
    try {
      const associate = await this.prisma.associado.findUnique({
        where: { id },
        include: { usuario: true },
      });

      if (!associate) {
        return { success: false, message: 'Associado não encontrado' };
      }

      // Update user status to INACTIVE
      await this.prisma.usuario.update({
        where: { id: associate.usuarioId },
        data: { status: 'INATIVO' },
      });

      // Add rejection reason to notes
      await this.prisma.associado.update({
        where: { id },
        data: {
          status: 'INATIVO',
          observacoes: reason ? `Rejeitado: ${reason}` : 'Rejeitado',
        },
      });

      return { success: true, message: 'Associado rejeitado' };
    } catch {
      return { success: false, message: 'Erro ao rejeitar associado' };
    }
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar status do associado' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    try {
      const associate = await this.prisma.associado.findUnique({
        where: { id },
        include: { usuario: true },
      });

      if (!associate) {
        return { success: false, message: 'Associado não encontrado' };
      }

      await this.prisma.$transaction([
        this.prisma.usuario.update({
          where: { id: associate.usuarioId },
          data: { status: status as any },
        }),
        this.prisma.associado.update({
          where: { id },
          data: { status: status as any },
        }),
      ]);

      return { success: true, message: 'Status atualizado com sucesso' };
    } catch {
      return { success: false, message: 'Erro ao atualizar status' };
    }
  }

  @Patch(':id/notes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar/atualizar notas do associado' })
  async updateNotes(@Param('id') id: string, @Body('notes') notes: string) {
    try {
      const associate = await this.prisma.associado.update({
        where: { id },
        data: { observacoes: notes },
      });

      return { success: true, data: associate };
    } catch {
      return { success: false, message: 'Erro ao atualizar notas' };
    }
  }

  @Post(':id/send-reminder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enviar lembrete de pagamento' })
  async sendReminder(@Param('id') id: string) {
    try {
      const associate = await this.prisma.associado.findUnique({
        where: { id },
        include: { usuario: true },
      });

      if (!associate) {
        return { success: false, message: 'Associado não encontrado' };
      }

      // Send reminder email
      await this.mailService.sendPaymentReminderEmail(
        associate.usuario.email,
        associate.usuario.nome,
      );

      return { success: true, message: 'Lembrete enviado com sucesso' };
    } catch {
      return { success: false, message: 'Erro ao enviar lembrete' };
    }
  }

  @Get('export/csv')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exportar associados em CSV' })
  async exportCSV(@Res() res: Response) {
    const associates = await this.prisma.associado.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            status: true,
            criadoEm: true,
          },
        },
      },
    });

    const data = exportAssociatesData(associates);
    const csv = toCSV(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${data.filename}.csv"`,
    );
    return res.send(csv);
  }

  @Get('export/excel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exportar associados em Excel' })
  async exportExcel(@Res() res: Response) {
    const associates = await this.prisma.associado.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            status: true,
            criadoEm: true,
          },
        },
      },
    });

    const data = exportAssociatesData(associates);
    const buffer = toExcel(data);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${data.filename}.xlsx"`,
    );
    return res.send(buffer);
  }
}
