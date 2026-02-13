import { PartialType } from '@nestjs/mapped-types';
import { CreateCrewPositionDto } from './create-crew-position.dto';

export class UpdateCrewPositionDto extends PartialType(CreateCrewPositionDto) {}
