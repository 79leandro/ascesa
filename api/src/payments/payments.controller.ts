import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
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
import { exportPaymentsData, toCSV, toExcel } from '../lib/export';
import type { Response } from 'express';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os pagamentos com filtros' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'month', required: false })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1');
    const limitNum = parseInt(limit || '20');
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (month) {
      where.mes = parseInt(month);
    }

    if (year) {
      where.ano = parseInt(year);
    }

    if (search) {
      where.OR = [
        { usuario: { nome: { contains: search, mode: 'insensitive' } } },
        { usuario: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [payments, total] = await Promise.all([
      this.prisma.pagamento.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { dataVencimento: 'desc' },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.pagamento.count({ where }),
    ]);

    return {
      success: true,
      data: payments,
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
  @ApiOperation({ summary: 'Obter estatísticas de pagamentos' })
  async getStats() {
    const [totalRecebido, totalPendente, totalAtrasado] = await Promise.all([
      this.prisma.pagamento.aggregate({
        where: { status: 'PAGO' },
        _sum: { valor: true },
      }),
      this.prisma.pagamento.aggregate({
        where: { status: 'PENDENTE' },
        _sum: { valor: true },
      }),
      this.prisma.pagamento.aggregate({
        where: { status: 'ATRASADO' },
        _sum: { valor: true },
      }),
    ]);

    const totalPendentes = await this.prisma.pagamento.count({
      where: { status: 'PENDENTE' },
    });

    const totalAtrasados = await this.prisma.pagamento.count({
      where: { status: 'ATRASADO' },
    });

    const inadimplencia =
      totalPendentes + totalAtrasados > 0
        ? ((totalAtrasados / (totalPendentes + totalAtrasados)) * 100).toFixed(
            1,
          )
        : '0';

    return {
      success: true,
      stats: {
        totalRecebido: totalRecebido._sum.valor || 0,
        totalPendente: totalPendente._sum.valor || 0,
        totalAtrasado: totalAtrasado._sum.valor || 0,
        totalPendentes,
        totalAtrasados,
        inadimplencia: Number(inadimplencia),
      },
    };
  }

  @Get('my-payments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar pagamentos do usuário logado' })
  async getMyPayments(@Body('userId') userId: string) {
    const payments = await this.prisma.pagamento.findMany({
      where: { usuarioId: userId },
      orderBy: { dataVencimento: 'desc' },
    });

    return { success: true, data: payments };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar pagamento por ID' })
  async findOne(@Param('id') id: string) {
    const payment = await this.prisma.pagamento.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });

    if (!payment) {
      return { success: false, message: 'Pagamento não encontrado' };
    }

    return { success: true, data: payment };
  }

  @Patch(':id/mark-paid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar pagamento como pago' })
  async markAsPaid(@Param('id') id: string) {
    try {
      const payment = await this.prisma.pagamento.update({
        where: { id },
        data: {
          status: 'PAGO',
          dataPagamento: new Date(),
        },
      });

      return { success: true, data: payment };
    } catch {
      return { success: false, message: 'Erro ao marcar pagamento como pago' };
    }
  }

  @Post('generate-monthly')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gerar cobranças mensais para todos os associados' })
  async generateMonthlyCharges(
    @Body() body: { month: number; year: number; amount: number },
  ) {
    try {
      const { month, year, amount } = body;

      // Get all active associates
      const associates = await this.prisma.usuario.findMany({
        where: { papel: 'ASSOCIADO', status: 'ATIVO' },
        select: { id: true },
      });

      // Generate payment records
      const paymentData = associates.map((associate) => ({
        usuarioId: associate.id,
        mes: month,
        ano: year,
        valor: amount,
        dataVencimento: new Date(year, month - 1, 10), // 10th of the month
        status: 'PENDENTE' as const,
      }));

      await this.prisma.pagamento.createMany({
        data: paymentData,
      });

      return {
        success: true,
        message: `${paymentData.length} cobranças geradas com sucesso`,
      };
    } catch {
      return { success: false, message: 'Erro ao gerar cobranças' };
    }
  }

  @Post(':id/send-reminder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enviar lembrete de pagamento' })
  async sendReminder(@Param('id') id: string) {
    try {
      const payment = await this.prisma.pagamento.findUnique({
        where: { id },
        include: {
          usuario: true,
        },
      });

      if (!payment) {
        return { success: false, message: 'Pagamento não encontrado' };
      }

      await this.mailService.sendPaymentReminderEmail(
        payment.usuario.email,
        payment.usuario.nome,
      );

      return { success: true, message: 'Lembrete enviado com sucesso' };
    } catch {
      return { success: false, message: 'Erro ao enviar lembrete' };
    }
  }

  @Post('update-overdue')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar status de pagamentos atrasados' })
  async updateOverduePayments() {
    const now = new Date();

    const result = await this.prisma.pagamento.updateMany({
      where: {
        status: 'PENDENTE',
        dataVencimento: { lt: now },
      },
      data: {
        status: 'ATRASADO',
      },
    });

    return {
      success: true,
      message: `${result.count} pagamentos marcados como atrasados`,
    };
  }

  @Get('export/csv')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exportar pagamentos em CSV' })
  async exportCSV(@Res() res: Response) {
    const payments = await this.prisma.pagamento.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });

    const data = exportPaymentsData(payments);
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
  @ApiOperation({ summary: 'Exportar pagamentos em Excel' })
  async exportExcel(@Res() res: Response) {
    const payments = await this.prisma.pagamento.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });

    const data = exportPaymentsData(payments);
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
