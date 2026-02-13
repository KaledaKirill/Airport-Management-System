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
import { CrewMembersService } from './crew-members.service';
import { CreateCrewMemberDto } from './dto/create-crew-member.dto';
import { UpdateCrewMemberDto } from './dto/update-crew-member.dto';
import { QueryCrewMemberDto } from './dto/query-crew-member.dto';

@Controller('crew-members')
export class CrewMembersController {
  constructor(private readonly crewMembersService: CrewMembersService) {}

  @Get()
  findAll(@Query() query: QueryCrewMemberDto) {
    return this.crewMembersService.findAll(query.skip, query.take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.crewMembersService.findOne(+id);
  }

  @Post()
  create(@Body() createCrewMemberDto: CreateCrewMemberDto) {
    return this.crewMembersService.create(createCrewMemberDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCrewMemberDto: UpdateCrewMemberDto) {
    return this.crewMembersService.update(+id, updateCrewMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.crewMembersService.remove(+id);
  }
}
