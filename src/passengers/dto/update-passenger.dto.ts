import { PartialType } from '@nestjs/mapped-types';
import { CreatePassengerDto } from './create-passenger.dto';

export class UpdatePassengerDto extends PartialType(CreatePassengerDto) {
  // All properties from CreatePassengerDto are inherited as optional
}
