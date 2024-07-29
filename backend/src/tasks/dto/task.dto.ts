import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class TaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationDto)
  locations: LocationDto[];
}

class LocationDto {
  @IsString()
  placeName: string;
  @IsString()
  details: string;
  @IsLatitude()
  latitude: number;
  @IsLongitude()
  longitude: number;
}
