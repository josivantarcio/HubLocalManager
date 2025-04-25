import { IsString, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  @Length(14, 14)
  cnpj: string;
  
  @IsString()
  website: string;
}