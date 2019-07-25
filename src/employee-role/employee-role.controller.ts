import { Controller, Get, Post, Body } from '@nestjs/common';
import { SaveRoleDto } from './dto/save-role.dto';
import { EmployeeRole } from './entities/employee-role.entity';
import { RemoveRoleDto } from './dto/remove-role.dto';
import { EmployeeRoleService } from './employee-role.service';

@Controller('employee-role')
export class EmployeeRoleController {
  constructor(private readonly employeeRoleService: EmployeeRoleService) {}

  /**
   * Returns a list of all the employee roles in the database
   */
  @Get()
  async getRoles(): Promise<EmployeeRole[]> {
    return await this.employeeRoleService.getEmployeeRoles();
  }

  /**
   * Saves an employee role. If the role already exists, updates.
   */
  @Post('save')
  async addRole(@Body() details: SaveRoleDto) {
    await this.employeeRoleService.saveEmployeeRole(details);
    return true;
  }

  /**
   * Removes a role from the database. A replacement role is specified.
   * The replacement role must exist and not be the same as the role
   * being removed.
   * @param details
   */
  @Post('remove')
  async removeRole(@Body() details: RemoveRoleDto) {
    await this.employeeRoleService.removeEmployeeRole(details);
    return true;
  }

  @Get('highest-earning-by-role')
  async getHighestEarningbyRole() {
    return await this.employeeRoleService.findHighestPaidEmployeePerRole();
  }
}
