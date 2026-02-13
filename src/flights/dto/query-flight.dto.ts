import { QueryDto } from '../../common/dto/query.dto';
import { IsOptional, IsInt, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryFlightDto extends QueryDto {
  @ApiPropertyOptional({
    description: 'Filter flights by airline ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  airlineId?: number;

  @ApiPropertyOptional({
    description: 'Filter flights by status',
    example: 'scheduled',
    enum: ['scheduled', 'delayed', 'boarding', 'departed', 'arrived', 'cancelled'],
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter flights by departure date (ISO 8601 format)',
    example: '2024-03-15',
    type: Date,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;
}
