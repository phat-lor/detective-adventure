import { PartialType } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ClearLocationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(32)
  taskId: string;
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(32)
  locationId: string;
}
