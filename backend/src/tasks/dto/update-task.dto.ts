import { PartialType } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto';
import { TaskDto } from './task.dto';

export class UpdateTaskDto extends PartialType(TaskDto) {}
