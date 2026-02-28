import { Controller, Get, Patch, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../prisma';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

interface UpdateUserDto {
  nome?: string;
  telefone?: string;
  profissao?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
}

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  async findOne(@Param('id') id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        associado: true,
      },
    });

    if (!usuario) {
      return { success: false, message: 'Usuário não encontrado' };
    }

    return {
      success: true,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        telefone: usuario.telefone,
        cpf: usuario.cpf,
        status: usuario.status,
        papel: usuario.papel,
        associado: usuario.associado,
      },
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar dados do usuário' })
  async update(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
    try {
      const usuario = await this.prisma.usuario.update({
        where: { id },
        data: {
          nome: updateData.nome,
          telefone: updateData.telefone,
        },
      });

      // Update associated data if exists
      if (
        updateData.profissao ||
        updateData.endereco ||
        updateData.cidade ||
        updateData.estado
      ) {
        await this.prisma.associado.updateMany({
          where: { usuarioId: id },
          data: {
            profissao: updateData.profissao,
            endereco: updateData.endereco,
            cidade: updateData.cidade,
            estado: updateData.estado,
          },
        });
      }

      return {
        success: true,
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nome: usuario.nome,
          telefone: usuario.telefone,
        },
      };
    } catch {
      return { success: false, message: 'Erro ao atualizar usuário' };
    }
  }
}
