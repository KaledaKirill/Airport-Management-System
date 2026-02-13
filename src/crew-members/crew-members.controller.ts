import {
  Controller,
  Get,
  Post,
  Put,
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
import { CrewMembersService } from './crew-members.service';
import { CreateCrewMemberDto } from './dto/create-crew-member.dto';
import { UpdateCrewMemberDto } from './dto/update-crew-member.dto';
import { QueryCrewMemberDto } from './dto/query-crew-member.dto';
import { Superuser } from '../common/decorators/superuser.decorator';

@ApiTags('crew-members')
@Controller('crew-members')
export class CrewMembersController {
  constructor(private readonly crewMembersService: CrewMembersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all crew members', description: 'Retrieve a paginated list of all crew members.' })
  @ApiResponse({ status: 200, description: 'Crew members retrieved successfully' })
  findAll(@Query() query: QueryCrewMemberDto) {
    return this.crewMembersService.findAll(query.skip, query.take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get crew member by ID', description: 'Retrieve detailed information about a specific crew member.' })
  @ApiParam({ name: 'id', description: 'Crew member ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Crew member found' })
  @ApiResponse({ status: 404, description: 'Crew member not found' })
  findOne(@Param('id') id: string) {
    return this.crewMembersService.findOne(+id);
  }

  @Post()
  @Superuser()
  @ApiOperation({ summary: 'Create a new crew member', description: 'Create a new crew member with the provided information.' })
  @ApiResponse({ status: 201, description: 'Crew member created successfully', type: CreateCrewMemberDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiBearerAuth('superuser-api-key')
  create(@Body() createCrewMemberDto: CreateCrewMemberDto) {
    return this.crewMembersService.create(createCrewMemberDto);
  }

  @Put(':id')
  @Superuser()
  @ApiOperation({ summary: 'Update crew member information', description: 'Partially update crew member information. All fields are optional.' })
  @ApiParam({ name: 'id', description: 'Crew member ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Crew member updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Crew member not found' })
  @ApiBearerAuth('superuser-api-key')
  update(@Param('id') id: string, @Body() updateCrewMemberDto: UpdateCrewMemberDto) {
    return this.crewMembersService.update(+id, updateCrewMemberDto);
  }

  @Delete(':id')
  @Superuser()
  @ApiOperation({ summary: 'Delete a crew member', description: 'Permanently delete a crew member from the system.' })
  @ApiParam({ name: 'id', description: 'Crew member ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Crew member deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Crew member not found' })
  @ApiBearerAuth('superuser-api-key')
  remove(@Param('id') id: string) {
    return this.crewMembersService.remove(+id);
  }
}
