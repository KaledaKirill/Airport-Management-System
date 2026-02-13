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
import { BaggageService } from './baggage.service';
import { CreateBaggageDto } from './dto/create-baggage.dto';
import { UpdateBaggageDto } from './dto/update-baggage.dto';
import { QueryBaggageDto } from './dto/query-baggage.dto';
import { Superuser } from '../common/decorators/superuser.decorator';

@ApiTags('baggage')
@Controller('baggage')
export class BaggageController {
  constructor(private readonly baggageService: BaggageService) {}

  @Get()
  @ApiOperation({ summary: 'Get all baggage', description: 'Retrieve a paginated list of all baggage.' })
  @ApiResponse({ status: 200, description: 'Baggage retrieved successfully' })
  findAll(@Query() query: QueryBaggageDto) {
    return this.baggageService.findAll(query.skip, query.take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get baggage by ID', description: 'Retrieve detailed information about specific baggage.' })
  @ApiParam({ name: 'id', description: 'Baggage ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Baggage found' })
  @ApiResponse({ status: 404, description: 'Baggage not found' })
  findOne(@Param('id') id: string) {
    return this.baggageService.findOne(+id);
  }

  @Post()
  @Superuser()
  @ApiOperation({ summary: 'Create new baggage', description: 'Create new baggage with the provided information.' })
  @ApiResponse({ status: 201, description: 'Baggage created successfully', type: CreateBaggageDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiBearerAuth('superuser-api-key')
  create(@Body() createBaggageDto: CreateBaggageDto) {
    return this.baggageService.create(createBaggageDto);
  }

  @Put(':id')
  @Superuser()
  @ApiOperation({ summary: 'Update baggage information', description: 'Partially update baggage information. All fields are optional.' })
  @ApiParam({ name: 'id', description: 'Baggage ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Baggage updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Baggage not found' })
  @ApiBearerAuth('superuser-api-key')
  update(@Param('id') id: string, @Body() updateBaggageDto: UpdateBaggageDto) {
    return this.baggageService.update(+id, updateBaggageDto);
  }

  @Delete(':id')
  @Superuser()
  @ApiOperation({ summary: 'Delete baggage', description: 'Permanently delete baggage from the system.' })
  @ApiParam({ name: 'id', description: 'Baggage ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Baggage deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Baggage not found' })
  @ApiBearerAuth('superuser-api-key')
  remove(@Param('id') id: string) {
    return this.baggageService.remove(+id);
  }
}
