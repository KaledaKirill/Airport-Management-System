import { PartialType } from '@nestjs/mapped-types';
import { CreateBaggageDto } from './create-baggage.dto';

export class UpdateBaggageDto extends PartialType(CreateBaggageDto) {
  // All properties from CreateBaggageDto are inherited as optional
}
