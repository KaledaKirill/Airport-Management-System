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
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { QueryFlightDto } from './dto/query-flight.dto';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
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
  findOne(@Param('id') id: string) {
    return this.flightsService.findOne(+id);
  }

  @Get(':id/crew')
  getCrew(@Param('id') id: string) {
    return this.flightsService.getCrew(+id);
  }

  @Get(':id/occupancy')
  getOccupancy(@Param('id') id: string) {
    return this.flightsService.getOccupancy(+id);
  }

  @Post()
  create(@Body() createFlightDto: CreateFlightDto) {
    return this.flightsService.create(createFlightDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFlightDto: UpdateFlightDto) {
    return this.flightsService.update(+id, updateFlightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flightsService.remove(+id);
  }
}
