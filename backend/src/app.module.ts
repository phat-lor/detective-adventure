import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthenticationModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { AccessControlModule } from 'nest-access-control';
import { RBAC_POLICY } from './rbac-policy';

import { ScheduleModule } from '@nestjs/schedule';
import { InvoicesModule } from './invoices/invoices.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    AuthenticationModule,
    UserModule,
    AccessControlModule.forRoles(RBAC_POLICY),
    InvoicesModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
