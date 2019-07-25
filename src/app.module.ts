import { Module, CacheModule } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    CacheModule.register(),

    DatabaseModule,
    EmployeeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
