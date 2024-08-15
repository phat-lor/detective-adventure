import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UseRoles } from 'nest-access-control';
import { ApiPaginatedResponse } from 'src/common/decorators/pagination.decorator';
import { TaskDto } from './dto/task.dto';
import { UpdateUserDto } from 'src/users/dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import { Image } from './model/Image.interface';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import { Response } from 'express';

export const storage = {
  storage: diskStorage({
    destination: './uploads/tasks-thumbnails',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // @UseRoles({
  //   resource: 'tasks',
  //   action: 'read',
  //   possession: 'any',
  // })
  @Get()
  @ApiPaginatedResponse(TaskDto)
  @Public()
  getAllTasks(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
  ) {
    return this.tasksService.getAllTasks(page, perPage);
  }

  @UseRoles({
    resource: 'tasks',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }
  @Public()
  @Post(':id/qr-code')
  getTaskQRById(@Param('id') id: string, @Body() data: any) {
    console.log(data);
    if (!data.baseUrl) throw new BadRequestException('Missing baseUrl');
    if (!data.locationIndex)
      throw new BadRequestException('Missing locationIndex');
    return this.tasksService.getTaskQRById(
      id,
      data.baseUrl,
      data.locationIndex,
    );
  }

  @UseRoles({
    resource: 'tasks',
    action: 'create',
    possession: 'any',
  })
  @Post()
  createTask(@Body() data: TaskDto) {
    return this.tasksService.createTask(data);
  }

  @UseRoles({
    resource: 'tasks',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }

  @UseRoles({
    resource: 'tasks',
    action: 'update',
    possession: 'any',
  })
  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() data: UpdateTaskDto) {
    return this.tasksService.updateTask(id, data);
  }

  @UseRoles({
    resource: 'tasks',
    action: 'update',
    possession: 'any',
  })
  @Post('image/upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Observable<Image> {
    return of(file);
  }

  @Public()
  @Get('image/:imagename')
  findImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
    return of(
      res.sendFile(
        join(process.cwd(), 'uploads/tasks-thumbnails/' + imagename),
      ),
    );
  }
}
