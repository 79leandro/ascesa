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

@ApiTags('Assemblies')
@Controller('assemblies')
export class AssembliesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as assembleias' })
  async findAll() {
    const assembleias = await this.prisma.assembleia.findMany({
      include: {
        candidatos: true,
      },
      orderBy: {
        data: 'desc',
      },
    });

    return {
      success: true,
      assembleias,
    };
  }

  @Get('ativas')
  @ApiOperation({ summary: 'Listar assembleias ativas para votação' })
  async findActive() {
    const assembleias = await this.prisma.assembleia.findMany({
      where: {
        status: 'EM_ANDAMENTO',
      },
      include: {
        candidatos: true,
      },
    });

    return {
      success: true,
      assembleias,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar assembleia por ID' })
  async findOne(@Param('id') id: string) {
    const assembleia = await this.prisma.assembleia.findUnique({
      where: { id },
      include: {
        candidatos: true,
        votos: {
          include: {
            candidato: true,
          },
        },
      },
    });

    if (!assembleia) {
      return { success: false, message: 'Assembleia não encontrada' };
    }

    return {
      success: true,
      assembleia,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar nova assembleia' })
  async create(@Body() body: any) {
    try {
      const assembleia = await this.prisma.assembleia.create({
        data: {
          titulo: body.titulo,
          tipo: body.tipo,
          data: new Date(body.data),
          hora: body.hora,
          local: body.local,
          descricao: body.descricao,
          status: 'AGENDADA',
          totalVotos: 0,
        },
      });

      return {
        success: true,
        assembleia,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao criar assembleia' };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar assembleia' })
  async update(@Param('id') id: string, @Body() body: any) {
    try {
      const assembleia = await this.prisma.assembleia.update({
        where: { id },
        data: {
          titulo: body.titulo,
          tipo: body.tipo,
          data: body.data ? new Date(body.data) : undefined,
          hora: body.hora,
          local: body.local,
          descricao: body.descricao,
          status: body.status,
        },
      });

      return {
        success: true,
        assembleia,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao atualizar assembleia' };
    }
  }

  @Patch(':id/iniciar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Iniciar votação' })
  async startVoting(@Param('id') id: string) {
    try {
      const assembleia = await this.prisma.assembleia.update({
        where: { id },
        data: {
          status: 'EM_ANDAMENTO',
        },
      });

      return {
        success: true,
        assembleia,
        message: 'Votação iniciada',
      };
    } catch (error) {
      return { success: false, message: 'Erro ao iniciar votação' };
    }
  }

  @Patch(':id/encerrar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encerrar votação' })
  async endVoting(@Param('id') id: string) {
    try {
      const assembleia = await this.prisma.assembleia.findUnique({
        where: { id },
        include: {
          candidatos: true,
        },
      });

      if (!assembleia) {
        return { success: false, message: 'Assembleia não encontrada' };
      }

      // Atualizar status
      const atualizado = await this.prisma.assembleia.update({
        where: { id },
        data: {
          status: 'ENCERRADA',
          totalVotos: assembleia.candidatos.reduce((acc, c) => acc + c.votos, 0),
        },
      });

      return {
        success: true,
        assembleia: atualizado,
        message: 'Votação encerrada',
      };
    } catch (error) {
      return { success: false, message: 'Erro ao encerrar votação' };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir assembleia' })
  async remove(@Param('id') id: string) {
    try {
      await this.prisma.assembleia.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Assembleia excluída com sucesso',
      };
    } catch (error) {
      return { success: false, message: 'Erro ao excluir assembleia' };
    }
  }

  // ============================================
  // Candidatos
  // ============================================

  @Post(':id/candidatos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar candidato a uma assembleia' })
  async addCandidate(@Param('id') id: string, @Body() body: any) {
    try {
      const candidato = await this.prisma.candidato.create({
        data: {
          assembleiaId: id,
          nome: body.nome,
          cargo: body.cargo,
          foto: body.foto,
        },
      });

      return {
        success: true,
        candidato,
      };
    } catch (error) {
      return { success: false, message: 'Erro ao adicionar candidato' };
    }
  }

  @Delete('candidatos/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover candidato' })
  async removeCandidate(@Param('id') id: string) {
    try {
      await this.prisma.candidato.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Candidato removido',
      };
    } catch (error) {
      return { success: false, message: 'Erro ao remover candidato' };
    }
  }

  // ============================================
  // Votação
  // ============================================

  @Post(':id/votar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Votar em um candidato' })
  async vote(
    @Param('id') id: string,
    @Body() body: { candidatoId: string },
    @Request() req: any,
  ) {
    try {
      const assembleia = await this.prisma.assembleia.findUnique({
        where: { id },
      });

      if (!assembleia) {
        return { success: false, message: 'Assembleia não encontrada' };
      }

      if (assembleia.status !== 'EM_ANDAMENTO') {
        return { success: false, message: 'Votação não está aberta' };
      }

      // Verificar se já votou
      const jaVotou = await this.prisma.voto.findUnique({
        where: {
          assembleiaId_usuarioId: {
            assembleiaId: id,
            usuarioId: req.user.id,
          },
        },
      });

      if (jaVotou) {
        return { success: false, message: 'Você já votou nesta assembleia' };
      }

      // Verificar se associado está ativo
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: req.user.id },
        include: { associado: true },
      });

      if (usuario?.papel === 'ASSOCIADO') {
        const associado = usuario.associado;
        if (!associado || associado.status !== 'ATIVO') {
          return { success: false, message: 'Apenas associados ativos podem votar' };
        }
      }

      // Criar voto
      await this.prisma.voto.create({
        data: {
          assembleiaId: id,
          candidatoId: body.candidatoId,
          usuarioId: req.user.id,
        },
      });

      // Incrementar votos do candidato
      await this.prisma.candidato.update({
        where: { id: body.candidatoId },
        data: { votos: { increment: 1 } },
      });

      return {
        success: true,
        message: 'Voto registrado com sucesso',
      };
    } catch (error) {
      return { success: false, message: 'Erro ao registrar voto' };
    }
  }

  @Get(':id/meu-voto')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar se já votei' })
  async getMyVote(@Param('id') id: string, @Request() req: any) {
    const voto = await this.prisma.voto.findFirst({
      where: {
        assembleiaId: id,
        usuarioId: req.user.id,
      },
      include: {
        candidato: true,
      },
    });

    return {
      success: true,
      voto,
    };
  }
}
