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

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(32)
  username: string;
  @IsString()
  @MinLength(5)
  @MaxLength(254)
  @IsPhoneNumber()
  phoneNumber: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  password: string;
  @IsOptional()
  @IsEnum(Role)
  role: Role;
  // @IsOptional()
  // addresses: UserAddressDto[];
}

export class UpdateUserDto extends PartialType(UserDto) {}

// export class UserAddressDto {
//   @IsString()
//   @IsNotEmpty()
//   address: string;
//   @IsString()
//   @IsNotEmpty()
//   city: string;
//   @IsString()
//   @IsNotEmpty()
//   state: string;
//   @IsString()
//   @IsNotEmpty()
//   country: string;
//   @IsString()
//   @IsNotEmpty()
//   zipCode: string;
// }
