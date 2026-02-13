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
import { AirlinesService } from './airlines.service';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';
import { QueryAirlineDto } from './dto/query-airline.dto';
import { Superuser } from '../common/decorators/superuser.decorator';

@Controller('airlines')
export class AirlinesController {
  constructor(private readonly airlinesService: AirlinesService) {}

  @Get()
  findAll(@Query() query: QueryAirlineDto) {
    return this.airlinesService.findAll(query.skip, query.take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airlinesService.findOne(+id);
  }

  @Post()
  @Superuser()
  create(@Body() createAirlineDto: CreateAirlineDto) {
    return this.airlinesService.create(createAirlineDto);
  }

  @Put(':id')
  @Superuser()
  update(@Param('id') id: string, @Body() updateAirlineDto: UpdateAirlineDto) {
    return this.airlinesService.update(+id, updateAirlineDto);
  }

  @Delete(':id')
  @Superuser()
  remove(@Param('id') id: string) {
    return this.airlinesService.remove(+id);
  }
}
