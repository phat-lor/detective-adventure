import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { QrCodeService } from './qrcode/qrcode.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, QrCodeService],
})
export class TasksModule {}
