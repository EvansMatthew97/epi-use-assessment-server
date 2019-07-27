import { Module, CacheModule } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { DatabaseModule } from './database/database.module';
import { EmployeeRoleModule } from './employee-role/employee-role.module';

@Module({
  imports: [
    CacheModule.register(),

    DatabaseModule,

    EmployeeModule,
    EmployeeRoleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
