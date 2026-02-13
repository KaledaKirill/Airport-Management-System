import { IsString, IsOptional, IsDate, MaxLength, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePassengerDto {
  @ApiProperty({
    description: 'Passport number of the passenger',
    example: 'AB1234567',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  passportNumber: string;

  @ApiProperty({
    description: 'Full name of the passenger',
    example: 'John Smith',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({
    description: 'Date of birth of the passenger (ISO 8601 format)',
    example: '1990-05-15',
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @ApiProperty({
    description: 'Nationality of the passenger',
    example: 'United States',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  nationality: string;

  @ApiPropertyOptional({
    description: 'Email address of the passenger',
    example: 'john.smith@example.com',
    maxLength: 100,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;
}
