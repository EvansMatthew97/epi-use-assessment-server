import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Employee } from './entities/employee.entity';
import { EmployeeRole } from './entities/employee-role.entity';
import { SaveEmployeeDto } from './dto/save-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveRoleDto } from './dto/save-role.dto';
import { RemoveRoleDto } from './dto/remove-role.dto';
import { RemoveEmployeeDto } from './dto/remove-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeRole)
    private readonly employeeRoleRepository: Repository<EmployeeRole>,
  ) {}

  /**
   * Return all employees in the database with their relation ids
   */
  async getEmployees(): Promise<Employee[]> {
    return await this.employeeRepository.find({
      where: {
        isActive: true,
      },
      loadRelationIds: true,
    });
  }

  /**
   * Removes an employee from the database. The record isn't actually deleted,
   * and instead is set to inactive
   * @param details
   */
  async removeEmployee(details: RemoveEmployeeDto) {
    const employee = await this.employeeRepository.findOne({
      where: {
        employeeNumber: details.employeeNumber,
        isActive: true,
      },
    });

    if (!employee) {
      throw new Error('Cannot find an employee with that employee number');
    }

    employee.isActive = false;

    await this.employeeRepository.save(employee);

    return employee;
  }

  /**
   * If an employee with the given employee number exists, updates the existing
   * employee. Otherwise creates a new employee entity with the given details.
   * If the employee number is given and the employee does not exist, creates an
   * employee entity with the given id.
   * @param employeeDetails
   */
  async saveEmployee(employeeDetails: SaveEmployeeDto) {
    // try find the existing employee in the database if the employee number
    // is given and the employee exists
    let employee = !employeeDetails.employeeNumber ? null : await this.employeeRepository.findOne({
      where: {
        isActive: true,
        employeeNumber: employeeDetails.employeeNumber,
      },
    });

    // if the employee does not exist, then create a new entity
    if (!employee) {
      employee = new Employee();
      // assign the employee number if given, otherwise the entity will have one generated
      if (employeeDetails.employeeNumber) {
        employee.employeeNumber = employeeDetails.employeeNumber;
      }
    }

    // get the employee role and ensure it exists
    const employeeRole = await this.employeeRoleRepository.findOne({
      where: {
        isActive: true,
        id: employeeDetails.employeeRoleId,
      },
    });

    if (!employeeRole) {
      throw new Error('The provided employee role does not exist');
    }

    // find and check that the "reports to" employee exists if the parameter was given
    const reportsToEmployee = !employeeDetails.reportsToEmployeeId ? null : await this.employeeRepository.findOne({
      where: {
        isActive: true,
        employeeNumber: employeeDetails.reportsToEmployeeId,
      },
    });

    // if the employee id was given and the employee could not be found throw an error
    if (employeeDetails.reportsToEmployeeId && !reportsToEmployee) {
      throw new Error('The "reports to" employee could not be found');
    }

    // set the employee entity's details
    employee.name = employeeDetails.name;
    employee.surname = employeeDetails.surname;
    employee.birthdate = new Date(employeeDetails.birthdate);
    employee.salary = employeeDetails.salary;
    employee.role = employeeRole;
    employee.reportsTo = reportsToEmployee;

    // save the employee
    await this.employeeRepository.save(employee);
  }

  /**
   * Returns all employee roles from the database
   */
  async getEmployeeRoles(): Promise<EmployeeRole[]> {
    return await this.employeeRoleRepository.find({
      where: {
        isActive: true,
      },
    });
  }

  /**
   * Inserts or updates an existing employee role.
   * @param details
   */
  async saveEmployeeRole(details: SaveRoleDto) {
    // find existing role if id provided
    let role = !details.id ? null : await this.employeeRoleRepository.findOne({
      where: {
        isActive: true,
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
   * Removes the role with the given id from the database (sets it
   * to inactive).
   * Replaces all employees who had the role with the specified
   * role. There always needs to be at least one role.
   */
  async removeEmployeeRole(details: RemoveRoleDto) {
    // prevent a role being replaced by itself
    if (details.roleToRemoveId === details.roleToReplaceId) {
      throw new Error('Cannot replace removed role with the same role');
    }

    // find the role to remove
    const roleToRemove = await this.employeeRoleRepository.findOne({
      where: {
        isActive: true,
        id: details.roleToRemoveId,
      },
    });

    if (!roleToRemove) {
      throw new Error('Cannot find an employee role to remove with that id');
    }

    // find the role to replace with
    const roleToReplace = await this.employeeRoleRepository.findOne({
      where: {
        isActive: true,
        id: details.roleToReplaceId,
      },
    });

    if (!roleToReplace) {
      throw new Error('Cannot find an employee role to replace with that id');
    }

    // all employees who have the roles to be removed have their role replaced
    const employeesWithRole = await this.employeeRepository.find({
      where: {
        isActive: true,
        role: roleToRemove,
      },
    });

    await this.employeeRepository.save(employeesWithRole.map(employee => {
      employee.role = roleToReplace;
      return employee;
    }));

    // finally remove the role
    roleToRemove.isActive = false;
    await this.employeeRoleRepository.save(roleToRemove);
  }

  /**
   * Finds the highest earning employee per employee role
   */
  async findHighestPaidEmployeePerRole(): Promise<{
    [roleId: number]: Employee,
  }> {
    const roles = await this.employeeRoleRepository.find({
      where: {
        isActive: true,
      },
    });

    const result = {};

    await Promise.all(roles.map(role => new Promise(async resolve => {
      result[role.id] = await this.employeeRepository.findOne({
        where: {
          isActive: true,
          role,
        },
        order: {
          salary: 'DESC',
        },
      } as any);
      resolve();
    })));

    return result;
  }
}
