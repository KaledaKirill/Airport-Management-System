import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCrewPositionDto {
  @ApiProperty({
    description: 'Name of the crew position',
    example: 'Pilot',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  name: string;
}
