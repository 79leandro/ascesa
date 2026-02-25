import { Controller, Get, Patch, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../prisma';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  async findOne(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        associated: true,
      },
    });

    if (!user) {
      return { success: false, message: 'Usuário não encontrado' };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        cpf: user.cpf,
        status: user.status,
        role: user.role,
        associated: user.associated,
      },
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar dados do usuário' })
  async update(@Param('id') id: string, @Body() updateData: any) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          name: updateData.name,
          phone: updateData.phone,
        },
      });

      // Update associated data if exists
      if (updateData.profession || updateData.address || updateData.city || updateData.state) {
        await this.prisma.associated.updateMany({
          where: { userId: id },
          data: {
            profession: updateData.profession,
            address: updateData.address,
            city: updateData.city,
            state: updateData.state,
          },
        });
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
        },
      };
    } catch (error) {
      return { success: false, message: 'Erro ao atualizar usuário' };
    }
  }
}
