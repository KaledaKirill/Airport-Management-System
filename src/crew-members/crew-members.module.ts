import { Module } from '@nestjs/common';
import { CrewMembersService } from './crew-members.service';
import { CrewMembersController } from './crew-members.controller';

@Module({
  controllers: [CrewMembersController],
  providers: [CrewMembersService],
  exports: [CrewMembersService],
})
export class CrewMembersModule {}
