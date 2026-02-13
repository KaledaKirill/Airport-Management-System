import { IsString, MaxLength } from 'class-validator';

export class CreateAirportDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(10)
  iataCode: string;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsString()
  @MaxLength(100)
  country: string;

  @IsString()
  @MaxLength(10)
  timezone: string;
}
