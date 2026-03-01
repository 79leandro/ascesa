import { Controller, Get, Patch, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UsersService } from './users.service';

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
  constructor(private usersService: UsersService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  async findOne(@Param('id') id: string) {
    const usuario = await this.usersService.findOne(id);

    return {
      success: true,
      usuario,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar dados do usuário' })
  async update(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
    const usuario = await this.usersService.update(id, updateData);

    return {
      success: true,
      usuario,
    };
  }
}
