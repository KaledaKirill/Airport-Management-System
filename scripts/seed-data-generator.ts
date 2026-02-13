import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🎲 Starting test data generation...');

  // Get reference data
  const airlines = await prisma.airlines.findMany();
  const airports = await prisma.airports.findMany();
  const crewPositions = await prisma.crewPositions.findMany();

  if (airlines.length === 0 || airports.length === 0 || crewPositions.length === 0) {
    console.error('❌ Reference data not found. Please run seed first: npx prisma db seed');
    process.exit(1);
  }

  console.log(`📊 Found ${airlines.length} airlines, ${airports.length} airports, ${crewPositions.length} crew positions`);

  // Clear existing test data (except reference tables)
  console.log('🧹 Clearing existing data...');
  await prisma.crewAssignments.deleteMany();
  await prisma.baggage.deleteMany();
  await prisma.tickets.deleteMany();
  await prisma.flights.deleteMany();
  await prisma.crewMembers.deleteMany();
  await prisma.aircraft.deleteMany();
  await prisma.passengers.deleteMany();
  console.log('✅ Data cleared');

  // Generate Aircraft (20)
  console.log('✈️  Generating aircraft...');
  const aircraftData = [];
  const aircraftModels = [
    'Boeing 737-800', 'Boeing 777-300ER', 'Boeing 787-9',
    'Airbus A320neo', 'Airbus A350-900', 'Airbus A321',
    'Embraer E190', 'Bombardier CRJ900'
  ];

  for (let i = 0; i < 20; i++) {
    const airline = faker.helpers.arrayElement(airlines);
    const model = faker.helpers.arrayElement(aircraftModels);
    aircraftData.push({
      registrationNumber: `RA-${faker.string.numeric(4)}`,
      model,
      manufacturer: model.split(' ')[0],
      airlineId: airline.id,
      capacity: faker.number.int({ min: 100, max: 400 }),
      yearManufactured: faker.number.int({ min: 2010, max: 2024 }),
    });
  }
  await prisma.aircraft.createMany({ data: aircraftData });
  console.log('✅ 20 aircraft created');

  const allAircraft = await prisma.aircraft.findMany();

  // Generate Crew Members (30)
  console.log('👨‍✈️  Generating crew members...');
  const crewMembersData = [];

  for (let i = 0; i < 30; i++) {
    const airline = faker.helpers.arrayElement(airlines);
    const position = faker.helpers.arrayElement(crewPositions);
    crewMembersData.push({
      passportNumber: `${faker.string.numeric(2)} ${faker.string.numeric(2)}${faker.string.numeric(6)}`,
      fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
      crewPositionId: position.id,
      airlineId: airline.id,
      hireDate: faker.date.past({ years: 10 }),
      licenseNumber: faker.string.alphanumeric({ length: 10 }).toUpperCase(),
    });
  }
  await prisma.crewMembers.createMany({ data: crewMembersData });
  console.log('✅ 30 crew members created');

  const allCrewMembers = await prisma.crewMembers.findMany();

  // Generate Passengers (100)
  console.log('👤 Generating passengers...');
  const passengersData = [];

  for (let i = 0; i < 100; i++) {
    passengersData.push({
      passportNumber: `${faker.string.numeric(2)} ${faker.string.numeric(2)}${faker.string.numeric(6)}`,
      fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
      dateOfBirth: faker.date.past({ years: 70 }),
      nationality: faker.location.countryCode('alpha-2'),
      email: faker.internet.email(),
    });
  }
  await prisma.passengers.createMany({ data: passengersData });
  console.log('✅ 100 passengers created');

  const allPassengers = await prisma.passengers.findMany();

  // Generate Flights (50)
  console.log('🛫 Generating flights...');
  const flightsData = [];
  const statuses = ['scheduled', 'boarding', 'departed', 'arrived', 'cancelled', 'delayed'];

  for (let i = 0; i < 50; i++) {
    let departureAirport, arrivalAirport;
    do {
      departureAirport = faker.helpers.arrayElement(airports);
      arrivalAirport = faker.helpers.arrayElement(airports);
    } while (departureAirport.id === arrivalAirport.id);

    const airline = faker.helpers.arrayElement(airlines);
    const departureTime = faker.date.future({ years: 0.5 });
    const flightDuration = faker.number.int({ min: 2, max: 12 }) * 60 * 60 * 1000;
    const arrivalTime = new Date(departureTime.getTime() + flightDuration);

    const aircraft = faker.helpers.arrayElement(allAircraft) as typeof allAircraft[0];
    flightsData.push({
      flightNumber: `${airline.iataCode}${faker.string.numeric(4)}`,
      airlineId: airline.id,
      departureAirportId: departureAirport.id,
      arrivalAirportId: arrivalAirport.id,
      aircraftId: aircraft.id,
      departureTime,
      arrivalTime,
      status: faker.helpers.arrayElement(statuses) as string,
      gate: `A${faker.number.int({ min: 1, max: 30 })}`,
    });
  }
  await prisma.flights.createMany({ data: flightsData });
  console.log('✅ 50 flights created');

  const allFlights = await prisma.flights.findMany();

  // Generate Tickets (200)
  console.log('🎫 Generating tickets...');
  const ticketsData = [];
  const classes = ['economy', 'business', 'first'];
  const ticketStatuses = ['booked', 'checked_in', 'cancelled'];

  for (let i = 0; i < 200; i++) {
    const passenger = faker.helpers.arrayElement(allPassengers);
    const flight = faker.helpers.arrayElement(allFlights);
    const classType = faker.helpers.arrayElement(classes);

    ticketsData.push({
      ticketNumber: faker.string.alphanumeric({ length: 10 }).toUpperCase(),
      passengerId: passenger.id,
      flightId: flight.id,
      seatNumber: `${faker.number.int({ min: 1, max: 30 })}${faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E', 'F'])}`,
      class: classType,
      price: classType === 'economy' ? faker.number.int({ min: 100, max: 500 }) :
              classType === 'business' ? faker.number.int({ min: 500, max: 1500 }) :
              faker.number.int({ min: 1500, max: 5000 }),
      bookingDate: faker.date.past({ years: 1 }),
      status: faker.helpers.arrayElement(ticketStatuses),
    });
  }
  await prisma.tickets.createMany({ data: ticketsData });
  console.log('✅ 200 tickets created');

  const allTickets = await prisma.tickets.findMany();

  // Generate Baggage (300)
  console.log('🧳 Generating baggage...');
  const baggageData = [];
  const baggageTypes = ['checked', 'carry_on', 'oversized'];
  const baggageStatuses = ['checked_in', 'loaded', 'in_transit', 'delivered', 'lost'];

  for (let i = 0; i < 300; i++) {
    const ticket = faker.helpers.arrayElement(allTickets);

    baggageData.push({
      ticketId: ticket.id,
      tagNumber: faker.string.alphanumeric({ length: 10 }).toUpperCase(),
      weight: parseFloat(faker.number.float({ min: 5, max: 50, precision: 0.1 }).toFixed(2)),
      type: faker.helpers.arrayElement(baggageTypes),
      status: faker.helpers.arrayElement(baggageStatuses),
    });
  }
  await prisma.baggage.createMany({ data: baggageData });
  console.log('✅ 300 baggage items created');

  // Generate Crew Assignments (100)
  console.log('👥 Generating crew assignments...');
  const assignmentsData = [];

  for (const flight of allFlights) {
    const crewCount = faker.number.int({ min: 3, max: 8 });
    const availableCrew = allCrewMembers.filter(cm => {
      return cm.airlineId === flight.airlineId;
    });

    // Skip if no crew available for this airline
    if (availableCrew.length === 0) continue;

    for (let i = 0; i < Math.min(crewCount, availableCrew.length); i++) {
      const crewMember = faker.helpers.arrayElement(availableCrew);

      // Check if assignment already exists
      const exists = assignmentsData.some(a =>
        a.crewMemberId === crewMember.id && a.flightId === flight.id
      );

      if (!exists) {
        assignmentsData.push({
          crewMemberId: crewMember.id,
          flightId: flight.id,
        });
      }
    }
  }
  await prisma.crewAssignments.createMany({ data: assignmentsData });
  console.log('✅ Crew assignments created');

  console.log('🎉 Test data generation completed successfully!');
  console.log('📊 Summary:');
  console.log(`   - Aircraft: ${allAircraft.length}`);
  console.log(`   - Crew members: ${allCrewMembers.length}`);
  console.log(`   - Passengers: ${allPassengers.length}`);
  console.log(`   - Flights: ${allFlights.length}`);
  console.log(`   - Tickets: ${allTickets.length}`);
  console.log(`   - Baggage: ${baggageData.length}`);
  console.log(`   - Crew assignments: ${assignmentsData.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Test data generation failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
