import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository, TreeRepository, LessThan } from 'typeorm';

import { Employee } from './entities/employee.entity';
import { EmployeeRole } from '../employee-role/entities/employee-role.entity';
import { SaveEmployeeDto } from './dto/save-employee.dto';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { RemoveEmployeeDto } from './dto/remove-employee.dto';
import { format } from 'date-fns';

/**
 * Provides functions for interacting with employee entities
 * in a convenient and relaible manner.
 */
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
      loadRelationIds: true,
    });
  }

  /**
   * Finds an employee by employee number
   * @param id
   */
  async getEmployee(id: number) {
    return await this.employeeRepository.findOneOrFail(id);
  }

  /**
   * Search for an Employee by exact match of name and surname.
   * Case-insensitive.
   * @param name Employee's first name
   * @param surname Employee's second name
   */
  async findEmployeeByName(name, surname): Promise<Employee> {
    return await this.employeeRepository.createQueryBuilder()
      .where('LOWER(name) = LOWER(:name) AND LOWER(surname) = LOWER(:surname)', {
        name, surname,
      })
      .getOne();
  }

  /**
   * Find employees older than a certain date
   * @param birthdate Date to find employees born before
   */
  async findEmployeesOlderThan(birthdate: Date): Promise<Employee[]> {
    return await this.employeeRepository.find({
      where: {
        birthdate: LessThan(format(birthdate, 'YYYY-MM-DD HH:MM:SS')),
      },
    });
  }

  /**
   * Removes an employee from the database. The tree structure is
   * patched such that any employee that reported to the employee
   * instead reports to the employee they reported to.
   * @param details
   */
  async removeEmployee(details: RemoveEmployeeDto) {
    const employee = await this.employeeRepository.findOne({
      where: {
        id: details.employeeNumber,
      },
      loadEagerRelations: true,
      relations: ['reportsTo'],
    });
    if (!employee) {
      throw new BadRequestException('An employee with that id does not exist');
    }

    // find all employees who reported to the employee being removed
    const employeesWhoReportToDelete = await this.employeeRepository.find({
      where: {
        reportsTo: employee,
      },
    });

    // update the employees' reportsTo to the employee being removed's reportsTo field
    await Promise.all(employeesWhoReportToDelete.map(otherEmployee => new Promise(async resolve => {
      otherEmployee.reportsTo = employee.reportsTo || null;
      await this.employeeRepository.save(otherEmployee);
      resolve();
    })));

    // finally remove the employee
    const id = employee.id;
    await this.employeeRepository.remove(employee);
  }

  /**
   * If an employee with the given employee number exists, updates the existing
   * employee. Otherwise creates a new employee entity with the given details.
   * If the employee number is given and the employee does not exist, creates an
   * employee entity with the given id.
   * @param employeeDetails
   */
  async saveEmployee(employeeDetails: SaveEmployeeDto): Promise<Employee> {
    // try find the existing employee in the database if the employee number
    // is given and the employee exists
    let employee = !employeeDetails.employeeNumber
      ? null
      : await this.employeeRepository.findOne({
          where: {
            id: employeeDetails.employeeNumber,
          },
        });

    // if the employee does not exist, then create a new entity
    if (!employee) {
      employee = new Employee();
      // assign the employee number if given, otherwise the entity will have one generated
      if (employeeDetails.employeeNumber) {
        employee.id = employeeDetails.employeeNumber;
      }
    }

    // get the employee role and ensure it exists
    const employeeRole = await this.employeeRoleRepository.findOne({
      where: {
        id: employeeDetails.employeeRoleId,
      },
    });

    if (!employeeRole) {
      throw new BadRequestException('The provided employee role does not exist');
    }

    // find and check that the "reports to" employee exists if the parameter was given
    const reportsToEmployee = !employeeDetails.reportsToEmployeeId
      ? null
      : await this.employeeRepository.findOne({
          where: {
            id: employeeDetails.reportsToEmployeeId,
          },
        });

    // if the employee id was given and the employee could not be found throw an error
    if (employeeDetails.reportsToEmployeeId && !reportsToEmployee) {
      throw new BadRequestException('The "reports to" employee could not be found');
    }

    // prevent loops in tree structure
    if (reportsToEmployee && reportsToEmployee.id === employee.id) {
      throw new BadRequestException('An employee cannot report to themself');
    }

    const descendants = await this.findDescendants(employee); // TODO: fix await this.employeeRepository.findDescendants(employee);
    if (reportsToEmployee && descendants.find(descendant => descendant.id === reportsToEmployee.id)) {
      throw new BadRequestException('An employee cannot report to an employee who reports to them');
    }

    // set the employee entity's details
    employee.name = employeeDetails.name;
    employee.surname = employeeDetails.surname;
    employee.birthdate = new Date(employeeDetails.birthdate);
    employee.salary = employeeDetails.salary;
    employee.role = employeeRole;
    employee.reportsTo = reportsToEmployee;

    // save the employee
    return await this.employeeRepository.save(employee);
  }

  private async buildTrees(): Promise<{
    lookup: {[id: number]: Employee};
    roots: Employee[]
  }> {
    const employees = (await this.employeeRepository.find({
      loadRelationIds: true,
    }));
    employees.forEach(employee => {
      employee.oversees = [];
    });

    const lookup = employees.reduce((ob, employee) => {
      ob[employee.id] = employee;
      return ob;
    }, {});

    employees.forEach(employee => {
      if (!employee.reportsTo) {
        return;
      }
      // add the employee to the list of children
      lookup[employee.reportsTo as any].oversees.push(employee);
    });

    const roots = Object.keys(lookup).reduce((arr, id) => {
      const employee: Employee = lookup[id];
      if (!employee.reportsTo) {
        arr.push(employee);
      }
      return arr;
    }, []);

    return {
      lookup,
      roots,
    };
  }

  /**
   * Finds all descendant employees for the given employee.
   * Includes itself.
   */
  private async findDescendants(employee: Employee): Promise<Employee[]> {
    const { lookup } = await this.buildTrees();

    const root = lookup[employee.id];

    if (!root) {
      return [];
    }

    const searchNode = (node: Employee, descendants = []) => {
      descendants.push(node);
      node.oversees.forEach(child => searchNode(child, descendants));
      return descendants;
    };

    return searchNode(root);
  }

  /**
   * Returns the employee hierarchy by who they oversee
   * and respond to
   */
  async getHierarchy(): Promise<Employee[]> {
    const trees = await this.buildTrees();

    return trees.roots;
  }
}
