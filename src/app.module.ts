import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './employee/employee.module';
import { Employee } from './employee/entities/employee.entity';
import { EmployeeRole } from './employee/entities/employee-role.entity';

console.log('dburl', process.env.DATABASE_URL);
console.log('dburl', process.env.DATABASE_TYPE);

console.log(process.env);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      synchronize: true,
      url: process.env.DATABASE_URL || undefined,
      type: process.env.DATABASE_TYPE as any || 'postgres',
      database: process.env.DATABASE || undefined,

      entities: [
        Employee,
        EmployeeRole,
      ],
    }),
    CacheModule.register(),
    EmployeeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
