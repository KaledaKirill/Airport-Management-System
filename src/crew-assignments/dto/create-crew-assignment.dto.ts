import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCrewAssignmentDto {
  @IsInt()
  @Type(() => Number)
  crewMemberId: number;

  @IsInt()
  @Type(() => Number)
  flightId: number;
}
