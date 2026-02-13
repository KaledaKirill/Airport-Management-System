import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';

@Injectable()
export class AirportsService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 100) {
    return this.prisma.airports.findMany({
      skip,
      take,
    });
  }

  async findOne(id: number) {
    const airport = await this.prisma.airports.findUnique({
      where: { id: BigInt(id) },
    });

    if (!airport) {
      throw new NotFoundException(`Airport with ID ${id} not found`);
    }

    return airport;
  }

  async create(createAirportDto: CreateAirportDto) {
    return this.prisma.airports.create({
      data: createAirportDto,
    });
  }

  async update(id: number, updateAirportDto: UpdateAirportDto) {
    try {
      return await this.prisma.airports.update({
        where: { id: BigInt(id) },
        data: updateAirportDto,
      });
    } catch (error) {
      throw new NotFoundException(`Airport with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.airports.delete({
        where: { id: BigInt(id) },
      });
    } catch (error) {
      throw new NotFoundException(`Airport with ID ${id} not found`);
    }
  }
}
