import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Tree, TreeParent, TreeChildren } from 'typeorm';
import { EmployeeRole } from '../../employee-role/entities/employee-role.entity';

/**
 * Represents a single employee. Employees are represented as nodes
 * in a tree. An employee may not report to an employee that reports
 * to them in the hierarchy, nor may they report to themselves
 * (i.e. no loops).
 * Every employee has a role.
 * An employee may report to a single superior.
 * An employee may oversee or be reported to by multiple employees.
 */
@Entity()
@Tree('materialized-path')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  birthdate: Date;

  @Column()
  salary: number;

  /**
   * An employee has a certain role, defined in the EmployeeRole lookup table
   */
  @ManyToOne(type => EmployeeRole, employeeRole => employeeRole.employees)
  role: EmployeeRole;

  /**
   * An employee may oversee many employees
   */
  @TreeChildren()
  oversees: Employee[];

  /**
   * An employee may report to a single employee
   */
  @TreeParent()
  reportsTo: Employee;

  /**
   * Comparison operator for employees.
   * Uses the Employee's salary as means for comparison
   */
  valueOf(): number {
    return this.salary;
  }
}
