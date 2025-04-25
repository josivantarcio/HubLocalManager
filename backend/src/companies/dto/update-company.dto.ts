import { IsString, Length, IsOptional } from 'class-validator';

export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @Length(14, 14)
  @IsOptional()
  cnpj?: string;
}
