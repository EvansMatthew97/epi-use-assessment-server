import { Module, CacheModule } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { DatabaseModule } from './database/database.module';
import { EmployeeRoleModule } from './employee-role/employee-role.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CacheModule.register(),

    DatabaseModule,

    AuthModule,
    UsersModule,

    EmployeeModule,
    EmployeeRoleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
