import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 100) {
    return this.prisma.tickets.findMany({
      skip,
      take,
      include: {
        passenger: true,
        flight: {
          include: {
            airline: true,
            departureAirport: true,
            arrivalAirport: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const ticket = await this.prisma.tickets.findUnique({
      where: { id: BigInt(id) },
      include: {
        passenger: true,
        flight: {
          include: {
            airline: true,
            departureAirport: true,
            arrivalAirport: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return ticket;
  }

  async create(createTicketDto: CreateTicketDto) {
    return this.prisma.tickets.create({
      data: {
        ...createTicketDto,
        price: createTicketDto.price,
        passengerId: BigInt(createTicketDto.passengerId),
        flightId: BigInt(createTicketDto.flightId),
      },
      include: {
        passenger: true,
        flight: {
          include: {
            airline: true,
            departureAirport: true,
            arrivalAirport: true,
          },
        },
      },
    });
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    const data: any = { ...updateTicketDto };
    if (updateTicketDto.passengerId) {
      data.passengerId = BigInt(updateTicketDto.passengerId);
    }
    if (updateTicketDto.flightId) {
      data.flightId = BigInt(updateTicketDto.flightId);
    }
    if (updateTicketDto.price !== undefined) {
      data.price = updateTicketDto.price;
    }

    try {
      return await this.prisma.tickets.update({
        where: { id: BigInt(id) },
        data,
        include: {
          passenger: true,
          flight: {
            include: {
              airline: true,
              departureAirport: true,
              arrivalAirport: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.tickets.delete({
        where: { id: BigInt(id) },
      });
    } catch (error) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
  }
}
