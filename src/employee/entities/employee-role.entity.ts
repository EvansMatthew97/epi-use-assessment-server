import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Employee } from './employee.entity';

/**
 * Employee role lookup table
 */
@Entity()
export class EmployeeRole {
  @Column()
  isActive: boolean = true;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(t => Employee, e => e.role)
  employees: Employee[];
}
