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
import { CrewPositionsService } from './crew-positions.service';
import { CreateCrewPositionDto } from './dto/create-crew-position.dto';
import { UpdateCrewPositionDto } from './dto/update-crew-position.dto';
import { QueryCrewPositionDto } from './dto/query-crew-position.dto';
import { Superuser } from '../common/decorators/superuser.decorator';

@ApiTags('crew-positions')
@Controller('crew-positions')
export class CrewPositionsController {
  constructor(private readonly crewPositionsService: CrewPositionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all crew positions', description: 'Retrieve a paginated list of all crew positions.' })
  @ApiResponse({ status: 200, description: 'Crew positions retrieved successfully' })
  findAll(@Query() query: QueryCrewPositionDto) {
    return this.crewPositionsService.findAll(query.skip, query.take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get crew position by ID', description: 'Retrieve detailed information about a specific crew position.' })
  @ApiParam({ name: 'id', description: 'Crew position ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Crew position found' })
  @ApiResponse({ status: 404, description: 'Crew position not found' })
  findOne(@Param('id') id: string) {
    return this.crewPositionsService.findOne(+id);
  }

  @Post()
  @Superuser()
  @ApiOperation({ summary: 'Create a new crew position', description: 'Create a new crew position with the provided information.' })
  @ApiResponse({ status: 201, description: 'Crew position created successfully', type: CreateCrewPositionDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiBearerAuth('superuser-api-key')
  create(@Body() createCrewPositionDto: CreateCrewPositionDto) {
    return this.crewPositionsService.create(createCrewPositionDto);
  }

  @Put(':id')
  @Superuser()
  @ApiOperation({ summary: 'Update crew position information', description: 'Partially update crew position information. All fields are optional.' })
  @ApiParam({ name: 'id', description: 'Crew position ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Crew position updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Crew position not found' })
  @ApiBearerAuth('superuser-api-key')
  update(@Param('id') id: string, @Body() updateCrewPositionDto: UpdateCrewPositionDto) {
    return this.crewPositionsService.update(+id, updateCrewPositionDto);
  }

  @Delete(':id')
  @Superuser()
  @ApiOperation({ summary: 'Delete a crew position', description: 'Permanently delete a crew position from the system.' })
  @ApiParam({ name: 'id', description: 'Crew position ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Crew position deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Crew position not found' })
  @ApiBearerAuth('superuser-api-key')
  remove(@Param('id') id: string) {
    return this.crewPositionsService.remove(+id);
  }
}
