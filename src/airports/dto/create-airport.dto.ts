import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAirportDto {
  @ApiProperty({
    description: 'Name of the airport',
    example: 'John F. Kennedy International Airport',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'IATA code of the airport',
    example: 'JFK',
    maxLength: 10,
  })
  @IsString()
  @MaxLength(10)
  iataCode: string;

  @ApiProperty({
    description: 'City where the airport is located',
    example: 'New York',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({
    description: 'Country where the airport is located',
    example: 'United States',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  country: string;

  @ApiProperty({
    description: 'Timezone of the airport',
    example: 'America/New_York',
    maxLength: 10,
  })
  @IsString()
  @MaxLength(10)
  timezone: string;
}
