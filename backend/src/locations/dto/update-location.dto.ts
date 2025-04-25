import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';

export class UpdateLocationDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @Length(8, 8)
  @IsOptional()
  cep?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  street?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  number?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  neighborhood?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city?: string;

  @IsString()
  @Length(2, 2)
  @IsOptional()
  state?: string;
}