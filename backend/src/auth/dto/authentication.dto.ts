import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthenticationDto {
  @IsString()
  @IsPhoneNumber('TH')
  @MinLength(5)
  @MaxLength(254)
  phoneNumber?: string;
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @IsOptional()
  username?: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
