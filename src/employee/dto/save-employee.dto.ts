import { IsNotEmpty, Length, IsOptional, IsNumber, IsPositive, IsDateString } from 'class-validator';

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
  @IsDateString()
  birthdate: Date;

  @IsNumber()
  @IsPositive()
  salary: number;

  @IsNumber()
  employeeRoleId: number;

  @IsNumber()
  @IsOptional()
  reportsToEmployeeId: number;
}
