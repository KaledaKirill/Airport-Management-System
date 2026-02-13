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
import { PassengersService } from './passengers.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { QueryPassengerDto } from './dto/query-passenger.dto';

@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Get()
  findAll(@Query() query: QueryPassengerDto) {
    return this.passengersService.findAll(query.skip, query.take);
  }

  @Get('search')
  search(@Query('passport') passportNumber?: string, @Query('email') email?: string) {
    return this.passengersService.search(passportNumber, email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passengersService.findOne(+id);
  }

  @Post()
  create(@Body() createPassengerDto: CreatePassengerDto) {
    return this.passengersService.create(createPassengerDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePassengerDto: UpdatePassengerDto) {
    return this.passengersService.update(+id, updatePassengerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passengersService.remove(+id);
  }
}
