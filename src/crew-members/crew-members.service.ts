import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCrewMemberDto } from './dto/create-crew-member.dto';
import { UpdateCrewMemberDto } from './dto/update-crew-member.dto';

@Injectable()
export class CrewMembersService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 100) {
    return this.prisma.crewMembers.findMany({
      skip,
      take,
      include: {
        crewPosition: true,
        airline: true,
      },
    });
  }

  async findOne(id: number) {
    const member = await this.prisma.crewMembers.findUnique({
      where: { id: BigInt(id) },
      include: {
        crewPosition: true,
        airline: true,
      },
    });

    if (!member) {
      throw new NotFoundException(`Crew member with ID ${id} not found`);
    }

    return member;
  }

  async create(createCrewMemberDto: CreateCrewMemberDto) {
    return this.prisma.crewMembers.create({
      data: {
        ...createCrewMemberDto,
        crewPositionId: BigInt(createCrewMemberDto.crewPositionId),
        airlineId: BigInt(createCrewMemberDto.airlineId),
      },
      include: {
        crewPosition: true,
        airline: true,
      },
    });
  }

  async update(id: number, updateCrewMemberDto: UpdateCrewMemberDto) {
    const data: any = { ...updateCrewMemberDto };
    if (updateCrewMemberDto.crewPositionId) {
      data.crewPositionId = BigInt(updateCrewMemberDto.crewPositionId);
    }
    if (updateCrewMemberDto.airlineId) {
      data.airlineId = BigInt(updateCrewMemberDto.airlineId);
    }

    try {
      return await this.prisma.crewMembers.update({
        where: { id: BigInt(id) },
        data,
        include: {
          crewPosition: true,
          airline: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Crew member with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.crewMembers.delete({
        where: { id: BigInt(id) },
      });
    } catch (error) {
      throw new NotFoundException(`Crew member with ID ${id} not found`);
    }
  }
}
