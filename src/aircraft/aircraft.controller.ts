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
import { AircraftService } from './aircraft.service';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { UpdateAircraftDto } from './dto/update-aircraft.dto';
import { QueryAircraftDto } from './dto/query-aircraft.dto';
import { Superuser } from '../common/decorators/superuser.decorator';

@ApiTags('aircraft')
@Controller('aircraft')
export class AircraftController {
  constructor(private readonly aircraftService: AircraftService) {}

  @Get()
  @ApiOperation({ summary: 'Get all aircraft', description: 'Retrieve a paginated list of all aircraft.' })
  @ApiResponse({ status: 200, description: 'Aircraft retrieved successfully' })
  findAll(@Query() query: QueryAircraftDto) {
    return this.aircraftService.findAll(query.skip, query.take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get aircraft by ID', description: 'Retrieve detailed information about a specific aircraft.' })
  @ApiParam({ name: 'id', description: 'Aircraft ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Aircraft found' })
  @ApiResponse({ status: 404, description: 'Aircraft not found' })
  findOne(@Param('id') id: string) {
    return this.aircraftService.findOne(+id);
  }

  @Post()
  @Superuser()
  @ApiOperation({ summary: 'Create a new aircraft', description: 'Create a new aircraft with the provided information.' })
  @ApiResponse({ status: 201, description: 'Aircraft created successfully', type: CreateAircraftDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiBearerAuth('superuser-api-key')
  create(@Body() createAircraftDto: CreateAircraftDto) {
    return this.aircraftService.create(createAircraftDto);
  }

  @Put(':id')
  @Superuser()
  @ApiOperation({ summary: 'Update aircraft information', description: 'Partially update aircraft information. All fields are optional.' })
  @ApiParam({ name: 'id', description: 'Aircraft ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Aircraft updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Aircraft not found' })
  @ApiBearerAuth('superuser-api-key')
  update(@Param('id') id: string, @Body() updateAircraftDto: UpdateAircraftDto) {
    return this.aircraftService.update(+id, updateAircraftDto);
  }

  @Delete(':id')
  @Superuser()
  @ApiOperation({ summary: 'Delete an aircraft', description: 'Permanently delete an aircraft from the system.' })
  @ApiParam({ name: 'id', description: 'Aircraft ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Aircraft deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Aircraft not found' })
  @ApiBearerAuth('superuser-api-key')
  remove(@Param('id') id: string) {
    return this.aircraftService.remove(+id);
  }
}
