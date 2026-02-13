import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBaggageDto } from './dto/create-baggage.dto';
import { UpdateBaggageDto } from './dto/update-baggage.dto';

@Injectable()
export class BaggageService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 100) {
    return this.prisma.baggage.findMany({
      skip,
      take,
      include: {
        ticket: {
          include: {
            passenger: true,
            flight: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const baggage = await this.prisma.baggage.findUnique({
      where: { id: BigInt(id) },
      include: {
        ticket: {
          include: {
            passenger: true,
            flight: true,
          },
        },
      },
    });

    if (!baggage) {
      throw new NotFoundException(`Baggage with ID ${id} not found`);
    }

    return baggage;
  }

  async create(createBaggageDto: CreateBaggageDto) {
    // Business rule: weight > 0 AND <= 50
    const weight = Number(createBaggageDto.weight);
    if (weight <= 0 || weight > 50) {
      throw new BadRequestException('Baggage weight must be greater than 0 and less than or equal to 50 kg');
    }

    return this.prisma.baggage.create({
      data: {
        ...createBaggageDto,
        ticketId: BigInt(createBaggageDto.ticketId),
        weight: weight,
      },
      include: {
        ticket: {
          include: {
            passenger: true,
            flight: true,
          },
        },
      },
    });
  }

  async update(id: number, updateBaggageDto: UpdateBaggageDto) {
    const data: any = { ...updateBaggageDto };

    if (updateBaggageDto.ticketId) {
      data.ticketId = BigInt(updateBaggageDto.ticketId);
    }
    if (updateBaggageDto.weight !== undefined) {
      const weight = Number(updateBaggageDto.weight);
      if (weight <= 0 || weight > 50) {
        throw new BadRequestException('Baggage weight must be greater than 0 and less than or equal to 50 kg');
      }
      data.weight = weight;
    }

    try {
      return await this.prisma.baggage.update({
        where: { id: BigInt(id) },
        data,
        include: {
          ticket: {
            include: {
              passenger: true,
              flight: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Baggage with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.baggage.delete({
        where: { id: BigInt(id) },
      });
    } catch (error) {
      throw new NotFoundException(`Baggage with ID ${id} not found`);
    }
  }
}
