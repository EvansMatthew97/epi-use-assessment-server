import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../employee/entities/employee.entity';
import { EmployeeRole } from './entities/employee-role.entity';
import { EmployeeRoleService } from './employee-role.service';
import { EmployeeRoleController } from './employee-role.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmployeeRole, Employee,
    ]),
  ],
  providers: [
    EmployeeRoleService,
  ],
  controllers: [
    EmployeeRoleController,
  ],
})
export class EmployeeRoleModule {}
