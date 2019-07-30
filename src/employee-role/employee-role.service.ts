import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../employee/entities/employee.entity';
import { EmployeeRole } from './entities/employee-role.entity';
import { Repository } from 'typeorm';
import { SaveRoleDto } from './dto/save-role.dto';
import { RemoveRoleDto } from './dto/remove-role.dto';

@Injectable()
export class EmployeeRoleService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeRole)
    private readonly employeeRoleRepository: Repository<EmployeeRole>,
  ) {}

  /**
   * Returns all employee roles from the database
   */
  async getEmployeeRoles(): Promise<EmployeeRole[]> {
    return await this.employeeRoleRepository.find();
  }

  /**
   * Inserts or updates an existing employee role.
   * @param details
   */
  async saveEmployeeRole(details: SaveRoleDto) {
    // find existing role if id provided
    let role = !details.id
      ? null
      : await this.employeeRoleRepository.findOne({
          where: {
            id: details.id,
          },
        });

    // role doesn't exist, so create it
    if (!role) {
      role = new EmployeeRole();
      // assign role id if given
      if (details.id) {
        role.id = details.id;
      }
    }

    role.name = details.name;

    await this.employeeRoleRepository.save(role);
  }

  /**
   * Removes the role with the given id from the database.
   * Replaces all employees who had the role with the specified
   * role. There always needs to be at least one role.
   */
  async removeEmployeeRole(details: RemoveRoleDto) {
    // prevent a role being replaced by itself
    if (details.roleToRemoveId === details.roleToReplaceId) {
      throw new BadRequestException('Cannot replace removed role with the same role');
    }

    // find the role to remove
    const roleToRemove = await this.employeeRoleRepository.findOne({
      where: {
        id: details.roleToRemoveId,
      },
    });

    if (!roleToRemove) {
      throw new BadRequestException('Cannot find an employee role to remove with that id');
    }

    // find the role to replace with
    const roleToReplace = await this.employeeRoleRepository.findOne({
      where: {
        id: details.roleToReplaceId,
      },
    });

    if (!roleToReplace) {
      throw new BadRequestException('Cannot find an employee role to replace with that id');
    }

    // all employees who have the roles to be removed have their role replaced
    const employeesWithRole = await this.employeeRepository.find({
      where: {
        role: roleToRemove,
      },
    });

    await this.employeeRepository.save(
      employeesWithRole.map(employee => {
        employee.role = roleToReplace;
        return employee;
      }),
    );

    // finally remove the role
    await this.employeeRoleRepository.remove(roleToRemove);
  }

  /**
   * Finds the highest earning employee per employee role
   */
  async findHighestPaidEmployeePerRole(): Promise<{
    [roleId: number]: Employee;
  }> {
    const roles = await this.employeeRoleRepository.find();

    const result = {};

    await Promise.all(
      roles.map(
        role =>
          new Promise(async resolve => {
            result[role.id] = await this.employeeRepository.findOne({
              where: {
                role,
              },
              order: {
                salary: 'DESC',
              },
            } as any);
            resolve();
          }),
      ),
    );

    return result;
  }
}
