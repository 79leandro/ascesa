import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private prisma: PrismaService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Obter todas as estatísticas do dashboard' })
  async getDashboardStats() {
    // Executar todas as queries em paralelo para máxima performance
    const [
      associatesStats,
      paymentsStats,
      eventsCount,
      benefitsCount,
      partnersCount,
    ] = await Promise.all([
      // Associates stats
      Promise.all([
        this.prisma.usuario.count({ where: { papel: 'ASSOCIADO' } }),
        this.prisma.usuario.count({ where: { papel: 'ASSOCIADO', status: 'ATIVO' } }),
        this.prisma.usuario.count({ where: { papel: 'ASSOCIADO', status: 'INATIVO' } }),
        this.prisma.usuario.count({ where: { papel: 'ASSOCIADO', status: 'PENDENTE' } }),
      ]),
      // Payments stats
      Promise.all([
        this.prisma.pagamento.aggregate({
          where: { status: 'PAGO' },
          _sum: { valor: true },
        }),
        this.prisma.pagamento.count({ where: { status: 'PENDENTE' } }),
        this.prisma.pagamento.count({ where: { status: 'ATRASADO' } }),
      ]),
      // Other counts
      this.prisma.evento.count({ where: { ativo: true } }),
      this.prisma.beneficio.count({ where: { ativo: true } }),
      this.prisma.parceiro.count({ where: { ativo: true } }),
    ]);

    const [totalAssociates, activeAssociates, inactiveAssociates, pendingAssociates] = associatesStats;
    const [payments, pendingPayments, latePayments] = paymentsStats;

    // Calcular novos associados este mês
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newThisMonth = await this.prisma.usuario.count({
      where: {
        papel: 'ASSOCIADO',
        criadoEm: { gte: startOfMonth },
      },
    });

    // Calcular inadimplência
    const totalOutstanding = pendingPayments + latePayments;
    const inadimplencia = totalOutstanding > 0
      ? Number(((latePayments / totalOutstanding) * 100).toFixed(1))
      : 0;

    // Calcular crescimento mensal (últimos 6 meses)
    const monthlyGrowth = await this.getMonthlyGrowth();

    return {
      success: true,
      data: {
        associates: {
          total: totalAssociates,
          active: activeAssociates,
          inactive: inactiveAssociates,
          pending: pendingAssociates,
          newThisMonth,
        },
        payments: {
          totalReceived: payments._sum.valor || 0,
          pendingPayments,
          latePayments,
          inadimplencia,
        },
        events: eventsCount,
        benefits: benefitsCount,
        partners: partnersCount,
        monthlyGrowth,
      },
    };
  }

  private async getMonthlyGrowth(): Promise<{ month: string; count: number }[]> {
    const months: { month: string; count: number }[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const count = await this.prisma.usuario.count({
        where: {
          papel: 'ASSOCIADO',
          criadoEm: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });

      months.push({
        month: monthStart.toLocaleDateString('pt-BR', { month: 'short' }),
        count,
      });
    }

    return months;
  }
}
