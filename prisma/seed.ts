import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Check if data already exists
  const existingAirlines = await prisma.airlines.count();
  if (existingAirlines > 0) {
    console.log('⚠️  Database already seeded. Skipping...');
    return;
  }

  // Airlines
  console.log('📁 Seeding airlines...');
  await prisma.airlines.createMany({
    data: [
      { name: 'Aeroflot', iataCode: 'SU', country: 'Russia' },
      { name: 'Emirates', iataCode: 'EK', country: 'UAE' },
      { name: 'Lufthansa', iataCode: 'LH', country: 'Germany' },
      { name: 'Air France', iataCode: 'AF', country: 'France' },
      { name: 'British Airways', iataCode: 'BA', country: 'United Kingdom' },
      { name: 'Turkish Airlines', iataCode: 'TK', country: 'Turkey' },
      { name: 'Qatar Airways', iataCode: 'QR', country: 'Qatar' },
      { name: 'Singapore Airlines', iataCode: 'SQ', country: 'Singapore' },
      { name: 'Japan Airlines', iataCode: 'JL', country: 'Japan' },
      { name: 'KLM', iataCode: 'KL', country: 'Netherlands' },
    ],
  });
  console.log('✅ Airlines seeded');

  // Airports
  console.log('📁 Seeding airports...');
  await prisma.airports.createMany({
    data: [
      { name: 'Sheremetyevo', iataCode: 'SVO', city: 'Moscow', country: 'Russia', timezone: 'UTC+3' },
      { name: 'Domodedovo', iataCode: 'DME', city: 'Moscow', country: 'Russia', timezone: 'UTC+3' },
      { name: 'Pulkovo', iataCode: 'LED', city: 'St. Petersburg', country: 'Russia', timezone: 'UTC+3' },
      { name: 'Dubai International', iataCode: 'DXB', city: 'Dubai', country: 'UAE', timezone: 'UTC+4' },
      { name: 'Frankfurt Airport', iataCode: 'FRA', city: 'Frankfurt', country: 'Germany', timezone: 'UTC+1' },
      { name: 'Charles de Gaulle', iataCode: 'CDG', city: 'Paris', country: 'France', timezone: 'UTC+1' },
      { name: 'Heathrow', iataCode: 'LHR', city: 'London', country: 'United Kingdom', timezone: 'UTC+0' },
      { name: 'Istanbul Airport', iataCode: 'IST', city: 'Istanbul', country: 'Turkey', timezone: 'UTC+3' },
      { name: 'Hamad International', iataCode: 'DOH', city: 'Doha', country: 'Qatar', timezone: 'UTC+3' },
      { name: 'Changi', iataCode: 'SIN', city: 'Singapore', country: 'Singapore', timezone: 'UTC+8' },
      { name: 'Narita', iataCode: 'NRT', city: 'Tokyo', country: 'Japan', timezone: 'UTC+9' },
      { name: 'Schiphol', iataCode: 'AMS', city: 'Amsterdam', country: 'Netherlands', timezone: 'UTC+1' },
      { name: 'John F. Kennedy', iataCode: 'JFK', city: 'New York', country: 'USA', timezone: 'UTC-5' },
      { name: 'Los Angeles International', iataCode: 'LAX', city: 'Los Angeles', country: 'USA', timezone: 'UTC-8' },
      { name: 'Beijing Capital', iataCode: 'PEK', city: 'Beijing', country: 'China', timezone: 'UTC+8' },
    ],
  });
  console.log('✅ Airports seeded');

  // Crew Positions
  console.log('📁 Seeding crew positions...');
  await prisma.crewPositions.createMany({
    data: [
      { name: 'Cpatin' },
      { name: 'First Officer' },
      { name: 'Flight Attendant' },
      { name: 'Senior Flight Attendant' },
      { name: 'Flight Engineer' },
    ],
  });
  console.log('✅ Crew positions seeded');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
