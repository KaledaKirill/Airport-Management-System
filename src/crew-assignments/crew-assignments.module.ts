import { Module } from '@nestjs/common';
import { CrewAssignmentsService } from './crew-assignments.service';
import { CrewAssignmentsController } from './crew-assignments.controller';

@Module({
  controllers: [CrewAssignmentsController],
  providers: [CrewAssignmentsService],
  exports: [CrewAssignmentsService],
})
export class CrewAssignmentsModule {}
