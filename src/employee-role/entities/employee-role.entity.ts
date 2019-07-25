import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Employee } from '../../employee/entities/employee.entity';

/**
 * Employee role lookup table
 */
@Entity()
export class EmployeeRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(t => Employee, e => e.role)
  employees: Employee[];
}
