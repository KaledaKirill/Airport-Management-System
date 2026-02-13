import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

@Injectable()
export class PassengersService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 100) {
    return this.prisma.passengers.findMany({
      skip,
      take,
    });
  }

  async findOne(id: number) {
    const passenger = await this.prisma.passengers.findUnique({
      where: { id: BigInt(id) },
    });

    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }

    return passenger;
  }

  async create(createPassengerDto: CreatePassengerDto) {
    return this.prisma.passengers.create({
      data: createPassengerDto,
    });
  }

  async update(id: number, updatePassengerDto: UpdatePassengerDto) {
    try {
      return await this.prisma.passengers.update({
        where: { id: BigInt(id) },
        data: updatePassengerDto,
      });
    } catch (error) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.passengers.delete({
        where: { id: BigInt(id) },
      });
    } catch (error) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
  }

  async search(passportNumber?: string, email?: string) {
    const where: any = {};
    if (passportNumber) {
      where.passportNumber = passportNumber;
    }
    if (email) {
      where.email = email;
    }

    return this.prisma.passengers.findMany({
      where,
    });
  }
}
