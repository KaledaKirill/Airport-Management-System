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
} from '@nestjs/swagger';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { QueryFlightDto } from './dto/query-flight.dto';

@ApiTags('flights')
@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all flights',
    description: 'Retrieve a paginated list of flights with optional filtering by airline, status, and date. Results include related airline, airport, and aircraft information.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of flights retrieved successfully',
  })
  findAll(@Query() query: QueryFlightDto) {
    return this.flightsService.findAll(
      query.skip,
      query.take,
      {
        airlineId: query.airlineId,
        status: query.status,
        date: query.date,
      },
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get flight by ID',
    description: 'Retrieve detailed information about a specific flight including related entities.',
  })
  @ApiParam({
    name: 'id',
    description: 'Flight ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Flight found',
  })
  @ApiResponse({ status: 404, description: 'Flight not found' })
  findOne(@Param('id') id: string) {
    return this.flightsService.findOne(+id);
  }

  @Get(':id/crew')
  @ApiOperation({
    summary: 'Get flight crew assignments',
    description: 'Retrieve all crew members assigned to a specific flight with their positions.',
  })
  @ApiParam({
    name: 'id',
    description: 'Flight ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Crew assignments retrieved',
  })
  getCrew(@Param('id') id: string) {
    return this.flightsService.getCrew(+id);
  }

  @Get(':id/occupancy')
  @ApiOperation({
    summary: 'Get flight occupancy statistics',
    description: 'Retrieve current booking statistics including capacity, booked tickets, available seats, and occupancy rate.',
  })
  @ApiParam({
    name: 'id',
    description: 'Flight ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Occupancy statistics retrieved',
  })
  @ApiResponse({ status: 404, description: 'Flight not found' })
  getOccupancy(@Param('id') id: string) {
    return this.flightsService.getOccupancy(+id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new flight',
    description: 'Create a new flight with the provided information. Validates that departure and arrival airports are different, and arrival time is after departure time.',
  })
  @ApiResponse({
    status: 201,
    description: 'Flight created successfully',
    type: CreateFlightDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  create(@Body() createFlightDto: CreateFlightDto) {
    return this.flightsService.create(createFlightDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update flight information',
    description: 'Partially update flight information. All fields are optional.',
  })
  @ApiParam({
    name: 'id',
    description: 'Flight ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Flight updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 404, description: 'Flight not found' })
  update(@Param('id') id: string, @Body() updateFlightDto: UpdateFlightDto) {
    return this.flightsService.update(+id, updateFlightDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a flight',
    description: 'Permanently delete a flight from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'Flight ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Flight deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Flight not found' })
  remove(@Param('id') id: string) {
    return this.flightsService.remove(+id);
  }
}
