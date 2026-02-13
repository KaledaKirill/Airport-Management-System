import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAirlineDto {
  @ApiProperty({
    description: 'Name of the airline',
    example: 'American Airlines',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({
    description: 'IATA code of the airline',
    example: 'AA',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  iataCode?: string;

  @ApiProperty({
    description: 'Country where the airline is registered',
    example: 'United States',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  country: string;
}
