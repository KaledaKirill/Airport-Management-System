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
import { BaggageService } from './baggage.service';
import { CreateBaggageDto } from './dto/create-baggage.dto';
import { UpdateBaggageDto } from './dto/update-baggage.dto';
import { QueryBaggageDto } from './dto/query-baggage.dto';

@Controller('baggage')
export class BaggageController {
  constructor(private readonly baggageService: BaggageService) {}

  @Get()
  findAll(@Query() query: QueryBaggageDto) {
    return this.baggageService.findAll(query.skip, query.take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.baggageService.findOne(+id);
  }

  @Post()
  create(@Body() createBaggageDto: CreateBaggageDto) {
    return this.baggageService.create(createBaggageDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBaggageDto: UpdateBaggageDto) {
    return this.baggageService.update(+id, updateBaggageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.baggageService.remove(+id);
  }
}
