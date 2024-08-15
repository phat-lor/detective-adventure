import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UseRoles } from 'nest-access-control';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { UpdateUserDto, UserDto } from './dto';
import { createPaginator } from 'prisma-pagination';
import { Prisma, Role, User } from '@prisma/client';
import { ApiPaginatedResponse } from 'src/common/decorators/pagination.decorator';
import { TaskDto } from 'src/tasks/dto/task.dto';
import { ClearLocationDto } from './dto/location.dto';

@Controller('users/me')
export class UserMeController {
  constructor(private readonly userService: UserService) {}

  @UseRoles({
    resource: 'profile',
    action: 'read',
    possession: 'own',
  })
  @Get()
  getCurrentUserInfo(@GetCurrentUserId() userId: string) {
    return this.userService.getUserInfo(userId);
  }

  @Patch()
  @UseRoles({
    resource: 'profile',
    action: 'update',
    possession: 'own',
  })
  updateCurrentUser(
    @GetCurrentUserId() userId: string,
    @Body() body: UpdateUserDto,
    @GetCurrentUser('roles') role: Role,
  ) {
    return this.userService.updateUser(userId, body, role);
  }

  @UseRoles({
    resource: 'tasks',
    action: 'read',
    possession: 'any',
  })
  @Get('tasks')
  @ApiPaginatedResponse(TaskDto)
  getUserTasks(
    @GetCurrentUserId() userId: string,
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
  ) {
    return this.userService.getUserTasks(userId, page, perPage);
  }

  @UseRoles({
    resource: 'tasks',
    action: 'read',
    possession: 'any',
  })
  @Post('tasks/start/:id')
  activateUserTaskById(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
  ) {
    return this.userService.startUserTaskById(userId, id);
  }

  @UseRoles({
    resource: 'tasks',
    action: 'read',
    possession: 'any',
  })
  @Post('tasks/clear')
  clearUserTasksLocation(
    @GetCurrentUserId() userId: string,
    @Body() body: ClearLocationDto,
  ) {
    return this.userService.clearLocation(userId, body.taskId, body.locationId);
  }

  @UseRoles({
    resource: 'tasks',
    action: 'read',
    possession: 'any',
  })
  @Get('tasks/:id')
  getUserTaskById(@GetCurrentUserId() userId: string, @Param('id') id: string) {
    return this.userService.getUserTaskById(userId, id);
  }
}
