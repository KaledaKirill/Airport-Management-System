import { IsString, IsInt, IsOptional, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({
    description: 'Unique ticket number',
    example: 'TKT-2024-001',
    maxLength: 30,
  })
  @IsString()
  @MaxLength(30)
  ticketNumber: string;

  @ApiProperty({
    description: 'ID of the passenger',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  passengerId: number;

  @ApiProperty({
    description: 'ID of the flight',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  flightId: number;

  @ApiPropertyOptional({
    description: 'Seat number assigned to the ticket',
    example: '12A',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  seatNumber?: string;

  @ApiPropertyOptional({
    description: 'Ticket class',
    example: 'economy',
    enum: ['economy', 'business', 'first'],
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  class?: string;

  @ApiProperty({
    description: 'Ticket price in USD',
    example: 299.99,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'Ticket status',
    example: 'confirmed',
    enum: ['reserved', 'confirmed', 'cancelled', 'checked-in'],
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;
}
