import { IsString, IsInt, IsOptional, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBaggageDto {
  @ApiProperty({
    description: 'ID of the ticket associated with this baggage',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  ticketId: number;

  @ApiProperty({
    description: 'Unique baggage tag number',
    example: 'BG123456',
    maxLength: 30,
  })
  @IsString()
  @MaxLength(30)
  tagNumber: string;

  @ApiProperty({
    description: 'Weight of the baggage in kilograms',
    example: 23.5,
    minimum: 0.01,
  })
  @IsInt()
  @Min(0.01)
  weight: number;

  @ApiPropertyOptional({
    description: 'Type of baggage',
    example: 'carry-on',
    enum: ['carry-on', 'checked', 'oversized'],
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @ApiPropertyOptional({
    description: 'Current status of the baggage',
    example: 'checked-in',
    enum: ['checked-in', 'loaded', 'in-flight', 'arrived', 'claimed', 'lost'],
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;
}
