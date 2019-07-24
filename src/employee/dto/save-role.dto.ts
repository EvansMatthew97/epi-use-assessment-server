import { IsOptional, IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class SaveRoleDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
