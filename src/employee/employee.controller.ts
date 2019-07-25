import { Controller, Post, Body, Get } from '@nestjs/common';
import { EmployeeService } from './employee.service';

import { Employee } from './entities/employee.entity';

import { SaveEmployeeDto } from './dto/save-employee.dto';
import { RemoveEmployeeDto } from './dto/remove-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

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
   * Removes an employee from the database.
   * @param details
   */
  @Post('remove')
  async removeEmployee(@Body() details: RemoveEmployeeDto) {
    await this.employeeService.removeEmployee(details);
    return true;
  }

  /**
   * Returns a tree hierarchy of all employees by who they oversee
   * and report to.
   */
  @Get('hierarchy')
  async getHierarchy(): Promise<Employee[]> {
    return await this.employeeService.getHierarchy();
  }
}
