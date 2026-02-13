import { IsString, IsInt, IsDate, IsOptional, Min, MaxLength, ValidationError } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFlightDto {
  @IsString()
  @MaxLength(20)
  flightNumber: string;

  @IsInt()
  @Type(() => Number)
  airlineId: number;

  @IsInt()
  @Type(() => Number)
  departureAirportId: number;

  @IsInt()
  @Type(() => Number)
  arrivalAirportId: number;

  @IsInt()
  @Type(() => Number)
  aircraftId: number;

  @IsDate()
  @Type(() => Date)
  departureTime: Date;

  @IsDate()
  @Type(() => Date)
  arrivalTime: Date;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  gate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;
}
