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
import { AirportsService } from './airports.service';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { QueryAirportDto } from './dto/query-airport.dto';
import { Superuser } from '../common/decorators/superuser.decorator';

@Controller('airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  @Get()
  findAll(@Query() query: QueryAirportDto) {
    return this.airportsService.findAll(query.skip, query.take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airportsService.findOne(+id);
  }

  @Post()
  @Superuser()
  create(@Body() createAirportDto: CreateAirportDto) {
    return this.airportsService.create(createAirportDto);
  }

  @Put(':id')
  @Superuser()
  update(@Param('id') id: string, @Body() updateAirportDto: UpdateAirportDto) {
    return this.airportsService.update(+id, updateAirportDto);
  }

  @Delete(':id')
  @Superuser()
  remove(@Param('id') id: string) {
    return this.airportsService.remove(+id);
  }
}
