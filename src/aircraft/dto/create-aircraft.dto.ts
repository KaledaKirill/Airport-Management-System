import { IsString, IsInt, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAircraftDto {
  @IsString()
  @MaxLength(20)
  registrationNumber: string;

  @IsString()
  @MaxLength(50)
  model: string;

  @IsString()
  @MaxLength(50)
  manufacturer: string;

  @IsInt()
  @Type(() => Number)
  airlineId: number;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsInt()
  @Min(1900)
  yearManufactured: number;
}
