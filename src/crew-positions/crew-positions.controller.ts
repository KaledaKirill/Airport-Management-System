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
import { CrewPositionsService } from './crew-positions.service';
import { CreateCrewPositionDto } from './dto/create-crew-position.dto';
import { UpdateCrewPositionDto } from './dto/update-crew-position.dto';
import { QueryCrewPositionDto } from './dto/query-crew-position.dto';
import { Superuser } from '../common/decorators/superuser.decorator';

@Controller('crew-positions')
export class CrewPositionsController {
  constructor(private readonly crewPositionsService: CrewPositionsService) {}

  @Get()
  findAll(@Query() query: QueryCrewPositionDto) {
    return this.crewPositionsService.findAll(query.skip, query.take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.crewPositionsService.findOne(+id);
  }

  @Post()
  @Superuser()
  create(@Body() createCrewPositionDto: CreateCrewPositionDto) {
    return this.crewPositionsService.create(createCrewPositionDto);
  }

  @Put(':id')
  @Superuser()
  update(@Param('id') id: string, @Body() updateCrewPositionDto: UpdateCrewPositionDto) {
    return this.crewPositionsService.update(+id, updateCrewPositionDto);
  }

  @Delete(':id')
  @Superuser()
  remove(@Param('id') id: string) {
    return this.crewPositionsService.remove(+id);
  }
}
