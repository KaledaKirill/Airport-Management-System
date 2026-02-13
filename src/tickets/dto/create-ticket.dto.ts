import { IsString, IsInt, IsDecimal, IsOptional, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketDto {
  @IsString()
  @MaxLength(30)
  ticketNumber: string;

  @IsInt()
  @Type(() => Number)
  passengerId: number;

  @IsInt()
  @Type(() => Number)
  flightId: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  seatNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  class?: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;
}
