import { IsString, IsInt, IsDate, IsOptional, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFlightDto {
  @ApiProperty({
    description: 'Unique flight identifier (e.g., AA123)',
    example: 'AA1234',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  flightNumber: string;

  @ApiProperty({
    description: 'ID of the airline operating the flight',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  airlineId: number;

  @ApiProperty({
    description: 'ID of the departure airport',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  departureAirportId: number;

  @ApiProperty({
    description: 'ID of the arrival airport',
    example: 2,
  })
  @IsInt()
  @Type(() => Number)
  arrivalAirportId: number;

  @ApiProperty({
    description: 'ID of the aircraft assigned to this flight',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  aircraftId: number;

  @ApiProperty({
    description: 'Scheduled departure time (ISO 8601 format)',
    example: '2024-03-15T10:00:00Z',
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  departureTime: Date;

  @ApiProperty({
    description: 'Scheduled arrival time (ISO 8601 format)',
    example: '2024-03-15T14:00:00Z',
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  arrivalTime: Date;

  @ApiPropertyOptional({
    description: 'Gate assignment for the flight',
    example: 'A12',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  gate?: string;

  @ApiPropertyOptional({
    description: 'Current status of the flight',
    example: 'scheduled',
    enum: ['scheduled', 'delayed', 'boarding', 'departed', 'arrived', 'cancelled'],
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;
}
