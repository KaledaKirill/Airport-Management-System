import { PartialType } from '@nestjs/mapped-types';
import { CreateFlightDto } from './create-flight.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFlightDto extends PartialType(CreateFlightDto) {
  // All properties from CreateFlightDto are inherited as optional
}
