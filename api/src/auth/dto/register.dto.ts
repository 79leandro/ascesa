import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { IsCPF } from 'class-validator-cpf';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsEmail({}, { message: 'Por favor, insira um email válido.' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @IsString({ message: 'A senha deve ser um texto.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;

  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString({ message: 'O nome deve ser um texto.' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  name: string;

  @IsOptional()
  @IsString({ message: 'O telefone deve ser um texto.' })
  phone?: string;

  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  @IsCPF({ message: 'Por favor, insira um CPF válido.' })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  cpf: string;

  @IsOptional()
  @IsDateString({}, { message: 'Por favor, insira uma data de nascimento válida.' })
  birthDate?: string;

  @IsOptional()
  @IsString({ message: 'A profissão deve ser um texto.' })
  profession?: string;

  @IsOptional()
  @IsString({ message: 'O endereço deve ser um texto.' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'A cidade deve ser um texto.' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'O estado deve ser um texto.' })
  state?: string;
}
