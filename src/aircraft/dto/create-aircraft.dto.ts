import { IsString, IsInt, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAircraftDto {
  @ApiProperty({
    description: 'Unique registration number of the aircraft',
    example: 'N12345',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  registrationNumber: string;

  @ApiProperty({
    description: 'Model of the aircraft',
    example: 'Boeing 737-800',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  model: string;

  @ApiProperty({
    description: 'Manufacturer of the aircraft',
    example: 'Boeing',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  manufacturer: string;

  @ApiProperty({
    description: 'ID of the airline that owns this aircraft',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  airlineId: number;

  @ApiProperty({
    description: 'Seating capacity of the aircraft',
    example: 180,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({
    description: 'Year the aircraft was manufactured',
    example: 2015,
    minimum: 1900,
  })
  @IsInt()
  @Min(1900)
  yearManufactured: number;
}
