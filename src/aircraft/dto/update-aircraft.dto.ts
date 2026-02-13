import { PartialType } from '@nestjs/mapped-types';
import { CreateAircraftDto } from './create-aircraft.dto';

export class UpdateAircraftDto extends PartialType(CreateAircraftDto) {
  // All properties from CreateAircraftDto are inherited as optional
}
