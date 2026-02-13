import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCrewPositionDto } from './dto/create-crew-position.dto';
import { UpdateCrewPositionDto } from './dto/update-crew-position.dto';

@Injectable()
export class CrewPositionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 100) {
    return this.prisma.crewPositions.findMany({
      skip,
      take,
    });
  }

  async findOne(id: number) {
    const position = await this.prisma.crewPositions.findUnique({
      where: { id: BigInt(id) },
    });

    if (!position) {
      throw new NotFoundException(`Crew position with ID ${id} not found`);
    }

    return position;
  }

  async create(createCrewPositionDto: CreateCrewPositionDto) {
    return this.prisma.crewPositions.create({
      data: createCrewPositionDto,
    });
  }

  async update(id: number, updateCrewPositionDto: UpdateCrewPositionDto) {
    try {
      return await this.prisma.crewPositions.update({
        where: { id: BigInt(id) },
        data: updateCrewPositionDto,
      });
    } catch (error) {
      throw new NotFoundException(`Crew position with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.crewPositions.delete({
        where: { id: BigInt(id) },
      });
    } catch (error) {
      throw new NotFoundException(`Crew position with ID ${id} not found`);
    }
  }
}
