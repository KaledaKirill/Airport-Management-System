import { IsString, MaxLength } from 'class-validator';

export class CreateCrewPositionDto {
  @IsString()
  @MaxLength(50)
  name: string;
}
