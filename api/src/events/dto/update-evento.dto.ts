import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventoDto {
  @ApiProperty({ required: false })
  titulo?: string;

  @ApiProperty({ required: false })
  descricao?: string;

  @ApiProperty({ required: false })
  data?: string;

  @ApiProperty({ required: false })
  horaInicio?: string;

  @ApiProperty({ required: false })
  horaFim?: string;

  @ApiProperty({ required: false })
  local?: string;

  @ApiProperty({ required: false })
  categoria?: string;

  @ApiProperty({ required: false })
  online?: boolean;

  @ApiProperty({ required: false })
  preco?: string | number;

  @ApiProperty({ required: false })
  vagas?: string | number;

  @ApiProperty({ required: false })
  imagem?: string;

  @ApiProperty({ required: false })
  ativo?: boolean;
}
