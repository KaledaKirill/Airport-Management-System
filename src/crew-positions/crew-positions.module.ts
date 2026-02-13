import { Module } from '@nestjs/common';
import { CrewPositionsService } from './crew-positions.service';
import { CrewPositionsController } from './crew-positions.controller';

@Module({
  controllers: [CrewPositionsController],
  providers: [CrewPositionsService],
  exports: [CrewPositionsService],
})
export class CrewPositionsModule {}
