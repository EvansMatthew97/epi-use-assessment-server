import { IsNotEmpty, Length, IsOptional, IsDate, IsNumber, IsPositive } from 'class-validator';
import { Optional } from '@nestjs/common';

export class SaveEmployeeDto {
  @IsOptional()
  employeeNumber?: number;

  @IsNotEmpty()
  @Length(1)
  name: string;

  @IsNotEmpty()
  @Length(1)
  surname: string;

  @IsNotEmpty()
  @IsDate()
  birthdate: Date;

  @IsNumber()
  @IsPositive()
  salary: number;

  @IsNumber()
  employeeRoleId: number;

  @IsNumber()
  @Optional()
  reportsToEmployeeId: number;
}
