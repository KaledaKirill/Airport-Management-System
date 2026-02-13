import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CrewAssignmentsService } from './crew-assignments.service';
import { CreateCrewAssignmentDto } from './dto/create-crew-assignment.dto';
import { QueryCrewAssignmentDto } from './dto/query-crew-assignment.dto';
import { Superuser } from '../common/decorators/superuser.decorator';

@ApiTags('crew-assignments')
@Controller('crew-assignments')
export class CrewAssignmentsController {
  constructor(private readonly crewAssignmentsService: CrewAssignmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all crew assignments', description: 'Retrieve a paginated list of all crew assignments.' })
  @ApiResponse({ status: 200, description: 'Crew assignments retrieved successfully' })
  findAll(@Query() query: QueryCrewAssignmentDto) {
    return this.crewAssignmentsService.findAll(query.skip, query.take);
  }

  @Get(':crewMemberId/:flightId')
  @ApiOperation({ summary: 'Get crew assignment', description: 'Retrieve a specific crew assignment by crew member ID and flight ID.' })
  @ApiParam({ name: 'crewMemberId', description: 'Crew member ID', example: '1' })
  @ApiParam({ name: 'flightId', description: 'Flight ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Crew assignment found' })
  @ApiResponse({ status: 404, description: 'Crew assignment not found' })
  findOne(
    @Param('crewMemberId') crewMemberId: string,
    @Param('flightId') flightId: string,
  ) {
    return this.crewAssignmentsService.findOne(+crewMemberId, +flightId);
  }

  @Post()
  @Superuser()
  @ApiOperation({ summary: 'Create a new crew assignment', description: 'Assign a crew member to a flight.' })
  @ApiResponse({ status: 201, description: 'Crew assignment created successfully', type: CreateCrewAssignmentDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiBearerAuth('superuser-api-key')
  create(@Body() createCrewAssignmentDto: CreateCrewAssignmentDto) {
    return this.crewAssignmentsService.create(createCrewAssignmentDto);
  }

  @Delete(':crewMemberId/:flightId')
  @Superuser()
  @ApiOperation({ summary: 'Delete a crew assignment', description: 'Remove a crew member from a flight.' })
  @ApiParam({ name: 'crewMemberId', description: 'Crew member ID', example: '1' })
  @ApiParam({ name: 'flightId', description: 'Flight ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Crew assignment deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Crew assignment not found' })
  @ApiBearerAuth('superuser-api-key')
  remove(
    @Param('crewMemberId') crewMemberId: string,
    @Param('flightId') flightId: string,
  ) {
    return this.crewAssignmentsService.remove(+crewMemberId, +flightId);
  }
}
