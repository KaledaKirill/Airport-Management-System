import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCrewAssignmentDto } from './dto/create-crew-assignment.dto';

@Injectable()
export class CrewAssignmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 100) {
    return this.prisma.crewAssignments.findMany({
      skip,
      take,
      include: {
        crewMember: {
          include: {
            crewPosition: true,
            airline: true,
          },
        },
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

  async findOne(crewMemberId: number, flightId: number) {
    const assignment = await this.prisma.crewAssignments.findUnique({
      where: {
        crewMemberId_flightId: {
          crewMemberId: BigInt(crewMemberId),
          flightId: BigInt(flightId),
        },
      },
      include: {
        crewMember: {
          include: {
            crewPosition: true,
            airline: true,
          },
        },
        flight: {
          include: {
            airline: true,
            departureAirport: true,
            arrivalAirport: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException(
        `Assignment for crew member ${crewMemberId} on flight ${flightId} not found`,
      );
    }

    return assignment;
  }

  async create(createCrewAssignmentDto: CreateCrewAssignmentDto) {
    // Business rule: One crew member cannot be assigned to the same flight twice
    const existing = await this.prisma.crewAssignments.findUnique({
      where: {
        crewMemberId_flightId: {
          crewMemberId: BigInt(createCrewAssignmentDto.crewMemberId),
          flightId: BigInt(createCrewAssignmentDto.flightId),
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Crew member is already assigned to this flight',
      );
    }

    return this.prisma.crewAssignments.create({
      data: {
        crewMemberId: BigInt(createCrewAssignmentDto.crewMemberId),
        flightId: BigInt(createCrewAssignmentDto.flightId),
      },
      include: {
        crewMember: {
          include: {
            crewPosition: true,
            airline: true,
          },
        },
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

  async remove(crewMemberId: number, flightId: number) {
    try {
      return await this.prisma.crewAssignments.delete({
        where: {
          crewMemberId_flightId: {
            crewMemberId: BigInt(crewMemberId),
            flightId: BigInt(flightId),
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(
        `Assignment for crew member ${crewMemberId} on flight ${flightId} not found`,
      );
    }
  }
}
