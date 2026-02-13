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
import { AirportsService } from './airports.service';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { QueryAirportDto } from './dto/query-airport.dto';
import { Superuser } from '../common/decorators/superuser.decorator';

@ApiTags('airports')
@Controller('airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all airports', description: 'Retrieve a paginated list of all airports.' })
  @ApiResponse({ status: 200, description: 'Airports retrieved successfully' })
  findAll(@Query() query: QueryAirportDto) {
    return this.airportsService.findAll(query.skip, query.take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get airport by ID', description: 'Retrieve detailed information about a specific airport.' })
  @ApiParam({ name: 'id', description: 'Airport ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Airport found' })
  @ApiResponse({ status: 404, description: 'Airport not found' })
  findOne(@Param('id') id: string) {
    return this.airportsService.findOne(+id);
  }

  @Post()
  @Superuser()
  @ApiOperation({ summary: 'Create a new airport', description: 'Create a new airport with the provided information.' })
  @ApiResponse({ status: 201, description: 'Airport created successfully', type: CreateAirportDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiBearerAuth('superuser-api-key')
  create(@Body() createAirportDto: CreateAirportDto) {
    return this.airportsService.create(createAirportDto);
  }

  @Put(':id')
  @Superuser()
  @ApiOperation({ summary: 'Update airport information', description: 'Partially update airport information. All fields are optional.' })
  @ApiParam({ name: 'id', description: 'Airport ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Airport updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Airport not found' })
  @ApiBearerAuth('superuser-api-key')
  update(@Param('id') id: string, @Body() updateAirportDto: UpdateAirportDto) {
    return this.airportsService.update(+id, updateAirportDto);
  }

  @Delete(':id')
  @Superuser()
  @ApiOperation({ summary: 'Delete an airport', description: 'Permanently delete an airport from the system.' })
  @ApiParam({ name: 'id', description: 'Airport ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Airport deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Airport not found' })
  @ApiBearerAuth('superuser-api-key')
  remove(@Param('id') id: string) {
    return this.airportsService.remove(+id);
  }
}
