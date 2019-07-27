import { Controller, Post, Body, Get, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { EmployeeService } from './employee.service';

import { Employee } from './entities/employee.entity';

import { SaveEmployeeDto } from './dto/save-employee.dto';
import { RemoveEmployeeDto } from './dto/remove-employee.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('employee')
@UseGuards(AuthGuard('jwt'))
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
   * Returns a single employee by employee number
   * @param employeeNumber The employee's employee number
   */
  @Get('search/id/:employeeNumber')
  async getEmployeeById(
    @Param('employeeNumber') employeeNumber: number,
  ): Promise<Employee> {
    try {
      return await this.employeeService.getEmployee(employeeNumber);
    } catch (exception) {
      throw new NotFoundException('Could not find an entity with that name');
    }
  }

  /**
   * Searches for a single employee by name and surname
   * Name is case-insensitive
   * @param name
   * @param surname
   */
  @Get('search/name/:name/:surname')
  async searchEmployeeByName(
    @Param('name') name: string,
    @Param('surname') surname: string,
  ): Promise<Employee> {
    return await this.employeeService.findEmployeeByName(name, surname);
  }

  @Get('search/older-than/:birthdate')
  async findEmployeesOlderThanDate(@Param('birthdate') birthdate): Promise<Employee[]> {
    birthdate = new Date(birthdate);
    return await this.employeeService.findEmployeesOlderThan(birthdate);
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
