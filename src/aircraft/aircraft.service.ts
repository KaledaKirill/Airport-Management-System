import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { UpdateAircraftDto } from './dto/update-aircraft.dto';

@Injectable()
export class AircraftService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 100) {
    return this.prisma.aircraft.findMany({
      skip,
      take,
      include: {
        airline: true,
      },
    });
  }

  async findOne(id: number) {
    const aircraft = await this.prisma.aircraft.findUnique({
      where: { id: BigInt(id) },
      include: {
        airline: true,
      },
    });

    if (!aircraft) {
      throw new NotFoundException(`Aircraft with ID ${id} not found`);
    }

    return aircraft;
  }

  async create(createAircraftDto: CreateAircraftDto) {
    return this.prisma.aircraft.create({
      data: {
        ...createAircraftDto,
        airlineId: BigInt(createAircraftDto.airlineId),
      },
      include: {
        airline: true,
      },
    });
  }

  async update(id: number, updateAircraftDto: UpdateAircraftDto) {
    const data: any = { ...updateAircraftDto };
    if (updateAircraftDto.airlineId) {
      data.airlineId = BigInt(updateAircraftDto.airlineId);
    }

    try {
      return await this.prisma.aircraft.update({
        where: { id: BigInt(id) },
        data,
        include: {
          airline: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Aircraft with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.aircraft.delete({
        where: { id: BigInt(id) },
      });
    } catch (error) {
      throw new NotFoundException(`Aircraft with ID ${id} not found`);
    }
  }
}
