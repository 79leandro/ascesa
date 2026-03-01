import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';

interface UpdateUserDto {
  nome?: string;
  telefone?: string;
  profissao?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        associado: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      telefone: usuario.telefone,
      cpf: usuario.cpf,
      status: usuario.status,
      papel: usuario.papel,
      associado: usuario.associado,
    };
  }

  async update(id: string, updateData: UpdateUserDto) {
    const existing = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Usuário não encontrado');
    }

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
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      telefone: usuario.telefone,
    };
  }
}
