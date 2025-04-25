import { IsNotEmpty, IsString, Length, IsNumber } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(8, 8)
  cep: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @Length(2, 2)
  state: string;

  @IsNumber()
  companyId: number;
}