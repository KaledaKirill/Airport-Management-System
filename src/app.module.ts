import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AirlinesModule } from './airlines/airlines.module';
import { AirportsModule } from './airports/airports.module';
import { CrewPositionsModule } from './crew-positions/crew-positions.module';
import { FlightsModule } from './flights/flights.module';
import { AircraftModule } from './aircraft/aircraft.module';
import { PassengersModule } from './passengers/passengers.module';
import { TicketsModule } from './tickets/tickets.module';
import { BaggageModule } from './baggage/baggage.module';
import { CrewMembersModule } from './crew-members/crew-members.module';
import { CrewAssignmentsModule } from './crew-assignments/crew-assignments.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    PrismaModule,
    AirlinesModule,
    AirportsModule,
    CrewPositionsModule,
    FlightsModule,
    AircraftModule,
    PassengersModule,
    TicketsModule,
    BaggageModule,
    CrewMembersModule,
    CrewAssignmentsModule,
    AdminModule,
  ],
})
export class AppModule {}
