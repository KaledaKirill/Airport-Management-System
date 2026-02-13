import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CrewAssignmentsService } from './crew-assignments.service';
import { CreateCrewAssignmentDto } from './dto/create-crew-assignment.dto';
import { QueryCrewAssignmentDto } from './dto/query-crew-assignment.dto';

@Controller('crew-assignments')
export class CrewAssignmentsController {
  constructor(private readonly crewAssignmentsService: CrewAssignmentsService) {}

  @Get()
  findAll(@Query() query: QueryCrewAssignmentDto) {
    return this.crewAssignmentsService.findAll(query.skip, query.take);
  }

  @Get(':crewMemberId/:flightId')
  findOne(
    @Param('crewMemberId') crewMemberId: string,
    @Param('flightId') flightId: string,
  ) {
    return this.crewAssignmentsService.findOne(+crewMemberId, +flightId);
  }

  @Post()
  create(@Body() createCrewAssignmentDto: CreateCrewAssignmentDto) {
    return this.crewAssignmentsService.create(createCrewAssignmentDto);
  }

  @Delete(':crewMemberId/:flightId')
  remove(
    @Param('crewMemberId') crewMemberId: string,
    @Param('flightId') flightId: string,
  ) {
    return this.crewAssignmentsService.remove(+crewMemberId, +flightId);
  }
}
