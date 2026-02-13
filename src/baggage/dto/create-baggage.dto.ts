import { IsString, IsInt, IsDecimal, IsOptional, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBaggageDto {
  @IsInt()
  @Type(() => Number)
  ticketId: number;

  @IsString()
  @MaxLength(30)
  tagNumber: string;

  @IsInt()
  @Min(0.01)
  weight: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;
}
