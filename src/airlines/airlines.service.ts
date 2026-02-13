import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';

@Injectable()
export class AirlinesService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 100) {
    return this.prisma.airlines.findMany({
      skip,
      take,
    });
  }

  async findOne(id: number) {
    const airline = await this.prisma.airlines.findUnique({
      where: { id: BigInt(id) },
    });

    if (!airline) {
      throw new NotFoundException(`Airline with ID ${id} not found`);
    }

    return airline;
  }

  async create(createAirlineDto: CreateAirlineDto) {
    return this.prisma.airlines.create({
      data: createAirlineDto,
    });
  }

  async update(id: number, updateAirlineDto: UpdateAirlineDto) {
    try {
      return await this.prisma.airlines.update({
        where: { id: BigInt(id) },
        data: updateAirlineDto,
      });
    } catch (error) {
      throw new NotFoundException(`Airline with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.airlines.delete({
        where: { id: BigInt(id) },
      });
    } catch (error) {
      throw new NotFoundException(`Airline with ID ${id} not found`);
    }
  }
}
