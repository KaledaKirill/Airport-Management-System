import { IsString, IsOptional, IsInt, MaxLength, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCrewMemberDto {
  @ApiProperty({
    description: 'Passport number of the crew member',
    example: 'CD9876543',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  passportNumber: string;

  @ApiProperty({
    description: 'Full name of the crew member',
    example: 'Jane Smith',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({
    description: 'ID of the crew position',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  crewPositionId: number;

  @ApiProperty({
    description: 'ID of the airline',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  airlineId: number;

  @ApiProperty({
    description: 'Date of hire (ISO 8601 format)',
    example: '2020-01-15',
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  hireDate: Date;

  @ApiPropertyOptional({
    description: 'License number of the crew member',
    example: 'LIC-12345',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  licenseNumber?: string;
}
