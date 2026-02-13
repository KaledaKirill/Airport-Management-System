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
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PassengersService } from './passengers.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { QueryPassengerDto } from './dto/query-passenger.dto';
import { Superuser } from '../common/decorators/superuser.decorator';

@ApiTags('passengers')
@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all passengers', description: 'Retrieve a paginated list of all passengers.' })
  @ApiResponse({ status: 200, description: 'Passengers retrieved successfully' })
  findAll(@Query() query: QueryPassengerDto) {
    return this.passengersService.findAll(query.skip, query.take);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search passengers', description: 'Search passengers by passport number or email.' })
  @ApiQuery({ name: 'passport', required: false, description: 'Passport number to search', example: 'AB1234567' })
  @ApiQuery({ name: 'email', required: false, description: 'Email address to search', example: 'john@example.com' })
  @ApiResponse({ status: 200, description: 'Passenger found' })
  search(@Query('passport') passportNumber?: string, @Query('email') email?: string) {
    return this.passengersService.search(passportNumber, email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get passenger by ID', description: 'Retrieve detailed information about a specific passenger.' })
  @ApiParam({ name: 'id', description: 'Passenger ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Passenger found' })
  @ApiResponse({ status: 404, description: 'Passenger not found' })
  findOne(@Param('id') id: string) {
    return this.passengersService.findOne(+id);
  }

  @Post()
  @Superuser()
  @ApiOperation({ summary: 'Create a new passenger', description: 'Create a new passenger with the provided information.' })
  @ApiResponse({ status: 201, description: 'Passenger created successfully', type: CreatePassengerDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiBearerAuth('superuser-api-key')
  create(@Body() createPassengerDto: CreatePassengerDto) {
    return this.passengersService.create(createPassengerDto);
  }

  @Put(':id')
  @Superuser()
  @ApiOperation({ summary: 'Update passenger information', description: 'Partially update passenger information. All fields are optional.' })
  @ApiParam({ name: 'id', description: 'Passenger ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Passenger updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Passenger not found' })
  @ApiBearerAuth('superuser-api-key')
  update(@Param('id') id: string, @Body() updatePassengerDto: UpdatePassengerDto) {
    return this.passengersService.update(+id, updatePassengerDto);
  }

  @Delete(':id')
  @Superuser()
  @ApiOperation({ summary: 'Delete a passenger', description: 'Permanently delete a passenger from the system.' })
  @ApiParam({ name: 'id', description: 'Passenger ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Passenger deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Passenger not found' })
  @ApiBearerAuth('superuser-api-key')
  remove(@Param('id') id: string) {
    return this.passengersService.remove(+id);
  }
}
