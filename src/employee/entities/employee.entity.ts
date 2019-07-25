import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { EmployeeRole } from '../../employee-role/entities/employee-role.entity';

/**
 * Represents a single employee.
 * Every employee has a role.
 * An employee may report to a single superior.
 * An employee may oversee or be reported to by multiple employees.
 */
@Entity()
export class Employee {
  @Column()
  isActive: boolean = true;

  @PrimaryGeneratedColumn()
  employeeNumber: number;

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
   * An employee may report to a single employee
   */
  @ManyToOne(t => Employee, employee => employee.oversees)
  reportsTo?: Employee;

  /**
   * An employee may oversee many employees
   */
  @OneToMany(t => Employee, employee => employee.reportsTo)
  oversees?: Employee[];

  /**
   * Comparison operator for employees.
   * Uses the Employee's salary as means for comparison
   */
  valueOf(): number {
    return this.salary;
  }
}
