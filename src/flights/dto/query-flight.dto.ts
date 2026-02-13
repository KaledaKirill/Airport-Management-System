import { IsOptional, IsInt, Min, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryFlightDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  airlineId?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;
}
