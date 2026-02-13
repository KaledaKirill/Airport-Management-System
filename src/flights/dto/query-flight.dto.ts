import { QueryDto } from '../../common/dto/query.dto';
import { IsOptional, IsInt, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryFlightDto extends QueryDto {
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
