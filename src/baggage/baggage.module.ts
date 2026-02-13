import { Module } from '@nestjs/common';
import { BaggageService } from './baggage.service';
import { BaggageController } from './baggage.controller';

@Module({
  controllers: [BaggageController],
  providers: [BaggageService],
  exports: [BaggageService],
})
export class BaggageModule {}
