import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Employee } from '../employee/entities/employee.entity';
import { EmployeeRole } from '../employee-role/entities/employee-role.entity';

/**
 * Configuration for testing. Uses SQLite rather than overwriting
 * the production database.
 */
const testConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'test-database.sqlite',
};

/**
 * The default database configuration. Defaults to postgres for
 * production mode. The database url would be given by the deployment
 * server.
 */
const defaultConfig: TypeOrmModuleOptions = {
  url: process.env.DATBASE_URL || undefined,
  type: (process.env.DATABASE_TYPE as any) || 'postgres',
  database: process.env.DATABASE || undefined,
};

/**
 * Database module
 */
@Module({
  imports: [
    TypeOrmModule.forRoot({
      synchronize: true,
      // if in the test environment use the test configuration
      ...(process.env.NODE_ENV === 'test' ? testConfig : defaultConfig),

      entities: [Employee, EmployeeRole],
    }),
  ],
})
export class DatabaseModule {}
