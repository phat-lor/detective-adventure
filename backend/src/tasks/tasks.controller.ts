import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UseRoles } from 'nest-access-control';
import { ApiPaginatedResponse } from 'src/common/decorators/pagination.decorator';
import { TaskDto } from './dto/task.dto';
import { UpdateUserDto } from 'src/users/dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseRoles({
    resource: 'tasks',
    action: 'read',
    possession: 'any',
  })
  @Get()
  @ApiPaginatedResponse(TaskDto)
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
}
