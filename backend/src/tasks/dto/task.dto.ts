import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  isURL,
  ValidateNested,
} from 'class-validator';

export class TaskDto {
  @IsNotEmpty()
  thumbnails: string[];
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
  @IsNotEmpty()
  thumbnails: string[];
  @IsString()
  placeName: string;
  @IsString()
  details: string;
  @IsLatitude()
  latitude: number;
  @IsLongitude()
  longitude: number;
}
