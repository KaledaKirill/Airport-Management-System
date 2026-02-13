import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateAirlineDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  iataCode?: string;

  @IsString()
  @MaxLength(100)
  country: string;
}
