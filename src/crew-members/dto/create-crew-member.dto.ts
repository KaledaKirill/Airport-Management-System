import { IsString, IsOptional, IsInt, MaxLength, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCrewMemberDto {
  @IsString()
  @MaxLength(20)
  passportNumber: string;

  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsInt()
  @Type(() => Number)
  crewPositionId: number;

  @IsInt()
  @Type(() => Number)
  airlineId: number;

  @IsDate()
  @Type(() => Date)
  hireDate: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  licenseNumber?: string;
}
