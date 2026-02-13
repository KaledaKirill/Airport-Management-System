import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class AdminService {
  private readonly backupsDir = path.join(process.cwd(), 'backups');

  constructor() {
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(this.backupsDir)) {
      fs.mkdirSync(this.backupsDir, { recursive: true });
    }
  }

  async createBackup(): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `airport_backup_${timestamp}.sql`;
      const filepath = path.join(this.backupsDir, filename);

      // Get DATABASE_URL from env
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) {
        throw new Error('DATABASE_URL not found in environment variables');
      }

      // Parse connection details from DATABASE_URL
      // Format: postgresql://user:password@host:port/database
      const url = new URL(dbUrl);
      const user = url.username;
      const password = url.password;
      const host = url.hostname;
      const port = url.port || '5432';
      const dbName = url.pathname.slice(1); // Remove leading '/'

      // Set PGPASSWORD environment variable for pg_dump
      process.env.PGPASSWORD = password;

      const command = `pg_dump -U ${user} -h ${host} -p ${port} -d ${dbName} -F p -f "${filepath}"`;

      await execAsync(command);

      // Compress the backup file
      await execAsync(`gzip "${filepath}"`);

      const gzippedFilename = `${filename}.gz`;
      const gzippedFilepath = path.join(this.backupsDir, gzippedFilename);

      return gzippedFilepath;
    } catch (error) {
      console.error('Backup error:', error);
      throw new InternalServerErrorException('Failed to create backup');
    }
  }

  async restoreBackup(backupFile: string): Promise<void> {
    try {
      const filepath = path.join(this.backupsDir, backupFile);

      // Check if file exists
      if (!fs.existsSync(filepath)) {
        throw new Error(`Backup file not found: ${backupFile}`);
      }

      // Get DATABASE_URL from env
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) {
        throw new Error('DATABASE_URL not found in environment variables');
      }

      // Parse connection details from DATABASE_URL
      const url = new URL(dbUrl);
      const user = url.username;
      const password = url.password;
      const host = url.hostname;
      const port = url.port || '5432';
      const dbName = url.pathname.slice(1);

      // Set PGPASSWORD environment variable for psql
      process.env.PGPASSWORD = password;

      // Decompress if needed
      let sqlFile = filepath;
      if (filepath.endsWith('.gz')) {
        await execAsync(`gunzip -k "${filepath}"`);
        sqlFile = filepath.replace('.gz', '');
      }

      // Restore the database
      const command = `psql -U ${user} -h ${host} -p ${port} -d ${dbName} -f "${sqlFile}"`;
      await execAsync(command);

      // Clean up decompressed file
      if (sqlFile !== filepath) {
        fs.unlinkSync(sqlFile);
      }
    } catch (error) {
      console.error('Restore error:', error);
      throw new InternalServerErrorException('Failed to restore backup');
    }
  }

  async exportData(): Promise<any> {
    // Export all data from all tables
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      const data = {
        airlines: await prisma.airlines.findMany(),
        airports: await prisma.airports.findMany(),
        crewPositions: await prisma.crewPositions.findMany(),
        flights: await prisma.flights.findMany(),
        aircraft: await prisma.aircraft.findMany(),
        passengers: await prisma.passengers.findMany(),
        tickets: await prisma.tickets.findMany(),
        baggage: await prisma.baggage.findMany(),
        crewMembers: await prisma.crewMembers.findMany(),
        crewAssignments: await prisma.crewAssignments.findMany(),
      };

      await prisma.$disconnect();

      return data;
    } catch (error) {
      console.error('Export error:', error);
      throw new InternalServerErrorException('Failed to export data');
    }
  }

  async listBackups(): Promise<string[]> {
    try {
      const files = fs.readdirSync(this.backupsDir);
      return files.filter((f) => f.endsWith('.sql.gz'));
    } catch (error) {
      return [];
    }
  }
}
