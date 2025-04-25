import { IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  @Length(14, 14)
  cnpj: string;

  @Type(() => Object)
  user: { id: number };
}