import { Controller, Post, Body, Get } from '@nestjs/common';
import { EmployeeService } from './employee.service';

import { Employee } from './entities/employee.entity';

import { SaveRoleDto } from './dto/save-role.dto';
import { SaveEmployeeDto } from './dto/save-employee.dto';
import { EmployeeRole } from './entities/employee-role.entity';
import { RemoveRoleDto } from './dto/remove-role.dto';

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
  ) {}

  /**
   * Returns a list of all employees in the database
   */
  @Get()
  async getEmployees(): Promise<Employee[]> {
    return await this.employeeService.getEmployees();
  }

  /**
   * Saves an employee. If the employee already exists, updates.
   * @param details
   */
  @Post('save')
  async saveEmployee(@Body() details: SaveEmployeeDto) {
    await this.employeeService.saveEmployee(details);
    return true;
  }

  /**
   * Returns a list of all the employee roles in the database
   */
  @Get('roles')
  async getRoles(): Promise<EmployeeRole[]> {
    return await this.employeeService.getEmployeeRoles();
  }

  /**
   * Saves an employee role. If the role already exists, updates.
   */
  @Post('saveRole')
  async addRole(@Body() details: SaveRoleDto) {
    await this.employeeService.saveEmployeeRole(details);
    return true;
  }

  /**
   * Removes a role from the database. A replacement role is specified.
   * The replacement role must exist and not be the same as the role
   * being removed.
   * @param details
   */
  @Post('removeRole')
  async removeRole(@Body() details: RemoveRoleDto) {
    await this.employeeService.removeEmployeeRole(details);
    return true;
  }
}
