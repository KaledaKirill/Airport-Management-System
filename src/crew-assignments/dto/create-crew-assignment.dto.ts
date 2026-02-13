import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCrewAssignmentDto {
  @ApiProperty({
    description: 'ID of the crew member',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  crewMemberId: number;

  @ApiProperty({
    description: 'ID of the flight',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  flightId: number;
}
