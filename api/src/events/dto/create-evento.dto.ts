import { ApiProperty } from '@nestjs/swagger';

export class CreateEventoDto {
  @ApiProperty()
  titulo: string;

  @ApiProperty({ required: false })
  descricao?: string;

  @ApiProperty()
  data: string;

  @ApiProperty()
  horaInicio: string;

  @ApiProperty()
  horaFim: string;

  @ApiProperty()
  local: string;

  @ApiProperty()
  categoria: string;

  @ApiProperty({ required: false })
  online?: boolean;

  @ApiProperty({ required: false })
  preco?: string | number;

  @ApiProperty({ required: false })
  vagas?: string | number;

  @ApiProperty({ required: false })
  imagem?: string;
}
