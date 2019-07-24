import { IsNumber } from 'class-validator';

export class RemoveEmployeeDto {
  @IsNumber()
  employeeNumber: number;
}
