import { PartialType } from '@nestjs/mapped-types';
import { CreateAirlineDto } from './create-airline.dto';

export class UpdateAirlineDto extends PartialType(CreateAirlineDto) {
  // All properties from CreateAirlineDto are inherited as optional
}
