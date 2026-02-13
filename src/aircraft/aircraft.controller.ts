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
import { AircraftService } from './aircraft.service';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { UpdateAircraftDto } from './dto/update-aircraft.dto';
import { QueryAircraftDto } from './dto/query-aircraft.dto';

@Controller('aircraft')
export class AircraftController {
  constructor(private readonly aircraftService: AircraftService) {}

  @Get()
  findAll(@Query() query: QueryAircraftDto) {
    return this.aircraftService.findAll(query.skip, query.take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aircraftService.findOne(+id);
  }

  @Post()
  create(@Body() createAircraftDto: CreateAircraftDto) {
    return this.aircraftService.create(createAircraftDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAircraftDto: UpdateAircraftDto) {
    return this.aircraftService.update(+id, updateAircraftDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aircraftService.remove(+id);
  }
}
