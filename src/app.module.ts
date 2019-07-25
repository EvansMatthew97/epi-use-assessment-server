import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EmployeeModule } from './employee/employee.module';
import { ConfigService } from './config/config.service';
import { Employee } from './employee/entities/employee.entity';
import { EmployeeRole } from './employee/entities/employee-role.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.databaseConfig,
        synchronize: true,
        entities: [
          Employee,
          EmployeeRole,
        ],
      } as TypeOrmModuleOptions),
      inject: [ConfigService],
    }),
    CacheModule.register(),
    EmployeeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
