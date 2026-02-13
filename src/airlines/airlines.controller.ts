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
import { AirlinesService } from './airlines.service';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';
import { QueryAirlineDto } from './dto/query-airline.dto';
import { Superuser } from '../common/decorators/superuser.decorator';

@ApiTags('airlines')
@Controller('airlines')
export class AirlinesController {
  constructor(private readonly airlinesService: AirlinesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all airlines', description: 'Retrieve a paginated list of all airlines.' })
  @ApiResponse({ status: 200, description: 'Airlines retrieved successfully' })
  findAll(@Query() query: QueryAirlineDto) {
    return this.airlinesService.findAll(query.skip, query.take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get airline by ID', description: 'Retrieve detailed information about a specific airline.' })
  @ApiParam({ name: 'id', description: 'Airline ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Airline found' })
  @ApiResponse({ status: 404, description: 'Airline not found' })
  findOne(@Param('id') id: string) {
    return this.airlinesService.findOne(+id);
  }

  @Post()
  @Superuser()
  @ApiOperation({ summary: 'Create a new airline', description: 'Create a new airline with the provided information.' })
  @ApiResponse({ status: 201, description: 'Airline created successfully', type: CreateAirlineDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiBearerAuth('superuser-api-key')
  create(@Body() createAirlineDto: CreateAirlineDto) {
    return this.airlinesService.create(createAirlineDto);
  }

  @Put(':id')
  @Superuser()
  @ApiOperation({ summary: 'Update airline information', description: 'Partially update airline information. All fields are optional.' })
  @ApiParam({ name: 'id', description: 'Airline ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Airline updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Airline not found' })
  @ApiBearerAuth('superuser-api-key')
  update(@Param('id') id: string, @Body() updateAirlineDto: UpdateAirlineDto) {
    return this.airlinesService.update(+id, updateAirlineDto);
  }

  @Delete(':id')
  @Superuser()
  @ApiOperation({ summary: 'Delete an airline', description: 'Permanently delete an airline from the system.' })
  @ApiParam({ name: 'id', description: 'Airline ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Airline deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Airline not found' })
  @ApiBearerAuth('superuser-api-key')
  remove(@Param('id') id: string) {
    return this.airlinesService.remove(+id);
  }
}
