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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseRoles({
    resource: 'profile',
    action: 'read',
    possession: 'own',
  })
  @Get('/me')
  getCurrentUserInfo(@GetCurrentUserId() userId: string) {
    return this.userService.getUserInfo(userId);
  }

  @Patch('/me')
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
    resource: 'profile',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  getUserInfo(@Param('id') id: string) {
    return this.userService.getUserInfoById(id);
  }

  @UseRoles({
    resource: 'profile',
    action: 'update',
    possession: 'any',
  })
  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() body: any,
    @GetCurrentUser('roles') role: Role,
  ) {
    return this.userService.updateUser(id, body, role);
  }

  @UseRoles({
    resource: 'profile',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  deleteUser(@Param('id') id: string, @GetCurrentUser('roles') role: Role) {
    return this.userService.deleteUser(id, role);
  }

  @Post()
  @UseRoles({
    resource: 'profile',
    action: 'create',
    possession: 'any',
  })
  createUser(@Body() body: UserDto, @GetCurrentUser('roles') role: Role) {
    return this.userService.createUser(body, role);
  }

  @UseRoles({
    resource: 'profile',
    action: 'read',
    possession: 'any',
  })
  @Get()
  @ApiPaginatedResponse(UserDto)
  getAllUsers(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
  ) {
    return this.userService.getAllUsers(page, perPage);
  }
}
