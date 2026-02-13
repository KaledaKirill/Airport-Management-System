import { IsString, IsOptional, IsDate, MaxLength, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePassengerDto {
  @IsString()
  @MaxLength(20)
  passportNumber: string;

  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsString()
  @MaxLength(50)
  nationality: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;
}
