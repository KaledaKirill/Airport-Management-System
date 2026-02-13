import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Injectable()
export class FlightsService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 100, filters?: { airlineId?: number; status?: string; date?: Date }) {
    const where: any = {};

    if (filters?.airlineId) {
      where.airlineId = BigInt(filters.airlineId);
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.date) {
      const date = new Date(filters.date);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      where.departureTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    return this.prisma.flights.findMany({
      where,
      skip,
      take,
      include: {
        airline: true,
        departureAirport: true,
        arrivalAirport: true,
        aircraft: true,
      },
      orderBy: {
        departureTime: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const flight = await this.prisma.flights.findUnique({
      where: { id: BigInt(id) },
      include: {
        airline: true,
        departureAirport: true,
        arrivalAirport: true,
        aircraft: true,
      },
    });

    if (!flight) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }

    return flight;
  }

  async create(createFlightDto: CreateFlightDto) {
    // Business rule: departure != arrival
    if (createFlightDto.departureAirportId === createFlightDto.arrivalAirportId) {
      throw new BadRequestException('Departure and arrival airports must be different');
    }

    // Business rule: arrival > departure
    if (new Date(createFlightDto.arrivalTime) <= new Date(createFlightDto.departureTime)) {
      throw new BadRequestException('Arrival time must be after departure time');
    }

    return this.prisma.flights.create({
      data: {
        ...createFlightDto,
        airlineId: BigInt(createFlightDto.airlineId),
        departureAirportId: BigInt(createFlightDto.departureAirportId),
        arrivalAirportId: BigInt(createFlightDto.arrivalAirportId),
        aircraftId: BigInt(createFlightDto.aircraftId),
      },
      include: {
        airline: true,
        departureAirport: true,
        arrivalAirport: true,
        aircraft: true,
      },
    });
  }

  async update(id: number, updateFlightDto: UpdateFlightDto) {
    const data: any = { ...updateFlightDto };

    if (updateFlightDto.airlineId) {
      data.airlineId = BigInt(updateFlightDto.airlineId);
    }
    if (updateFlightDto.departureAirportId) {
      data.departureAirportId = BigInt(updateFlightDto.departureAirportId);
    }
    if (updateFlightDto.arrivalAirportId) {
      data.arrivalAirportId = BigInt(updateFlightDto.arrivalAirportId);
    }
    if (updateFlightDto.aircraftId) {
      data.aircraftId = BigInt(updateFlightDto.aircraftId);
    }

    // Business rules
    if (updateFlightDto.departureAirportId && updateFlightDto.arrivalAirportId) {
      if (updateFlightDto.departureAirportId === updateFlightDto.arrivalAirportId) {
        throw new BadRequestException('Departure and arrival airports must be different');
      }
    }

    if (updateFlightDto.departureTime && updateFlightDto.arrivalTime) {
      if (new Date(updateFlightDto.arrivalTime) <= new Date(updateFlightDto.departureTime)) {
        throw new BadRequestException('Arrival time must be after departure time');
      }
    }

    try {
      return await this.prisma.flights.update({
        where: { id: BigInt(id) },
        data,
        include: {
          airline: true,
          departureAirport: true,
          arrivalAirport: true,
          aircraft: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.flights.delete({
        where: { id: BigInt(id) },
      });
    } catch (error) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }
  }

  // Special endpoint: Get flight crew
  async getCrew(flightId: number) {
    const assignments = await this.prisma.crewAssignments.findMany({
      where: {
        flightId: BigInt(flightId),
      },
      include: {
        crewMember: {
          include: {
            crewPosition: true,
          },
        },
      },
    });

    return assignments.map((a) => ({
      id: a.crewMember.id,
      fullName: a.crewMember.fullName,
      position: a.crewMember.crewPosition.name,
      assignedDate: a.assignedDate,
    }));
  }

  // Special endpoint: Get flight occupancy
  async getOccupancy(flightId: number) {
    const flight = await this.prisma.flights.findUnique({
      where: { id: BigInt(flightId) },
      include: {
        aircraft: true,
      },
    });

    if (!flight) {
      throw new NotFoundException(`Flight with ID ${flightId} not found`);
    }

    const bookedTickets = await this.prisma.tickets.count({
      where: {
        flightId: BigInt(flightId),
        status: {
          not: 'cancelled',
        },
      },
    });

    return {
      flightNumber: flight.flightNumber,
      capacity: flight.aircraft.capacity,
      bookedTickets,
      availableSeats: flight.aircraft.capacity - bookedTickets,
      occupancyRate: bookedTickets / flight.aircraft.capacity,
    };
  }
}
