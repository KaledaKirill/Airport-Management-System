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
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { QueryTicketDto } from './dto/query-ticket.dto';
import { Superuser } from '../common/decorators/superuser.decorator';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tickets', description: 'Retrieve a paginated list of all tickets.' })
  @ApiResponse({ status: 200, description: 'Tickets retrieved successfully' })
  findAll(@Query() query: QueryTicketDto) {
    return this.ticketsService.findAll(query.skip, query.take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by ID', description: 'Retrieve detailed information about a specific ticket.' })
  @ApiParam({ name: 'id', description: 'Ticket ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Ticket found' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Post()
  @Superuser()
  @ApiOperation({ summary: 'Create a new ticket', description: 'Create a new ticket with the provided information.' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully', type: CreateTicketDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiBearerAuth('superuser-api-key')
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Put(':id')
  @Superuser()
  @ApiOperation({ summary: 'Update ticket information', description: 'Partially update ticket information. All fields are optional.' })
  @ApiParam({ name: 'id', description: 'Ticket ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Ticket updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiBearerAuth('superuser-api-key')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  @Superuser()
  @ApiOperation({ summary: 'Delete a ticket', description: 'Permanently delete a ticket from the system.' })
  @ApiParam({ name: 'id', description: 'Ticket ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Ticket deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiBearerAuth('superuser-api-key')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
