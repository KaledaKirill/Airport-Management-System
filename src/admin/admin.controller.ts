import { Controller, Post, Get, Body, Res } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Superuser } from '../common/decorators/superuser.decorator';
import { Response } from 'express';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('backup')
  @Superuser()
  @ApiOperation({
    summary: 'Create database backup',
    description: 'Creates a backup of the entire database and stores it in the backups directory.',
  })
  @ApiResponse({
    status: 201,
    description: 'Backup created successfully',
    schema: {
      example: {
        success: true,
        message: 'Backup created successfully',
        filepath: './backups/backup_20240315_143022.sql',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiBearerAuth('superuser-api-key')
  async createBackup() {
    const filepath = await this.adminService.createBackup();
    return {
      success: true,
      message: 'Backup created successfully',
      filepath,
    };
  }

  @Post('restore')
  @Superuser()
  @ApiOperation({
    summary: 'Restore database from backup',
    description: 'Restores the database from a specified backup file. This operation will overwrite all existing data.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        backupFile: {
          type: 'string',
          example: './backups/backup_20240315_143022.sql',
          description: 'Path to the backup file to restore from',
        },
      },
      required: ['backupFile'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Database restored successfully',
    schema: {
      example: {
        success: true,
        message: 'Database restored successfully',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiBearerAuth('superuser-api-key')
  async restoreBackup(@Body('backupFile') backupFile: string) {
    await this.adminService.restoreBackup(backupFile);
    return {
      success: true,
      message: 'Database restored successfully',
    };
  }

  @Post('export')
  @Superuser()
  @ApiOperation({
    summary: 'Export all data',
    description: 'Exports all database data in JSON format.',
  })
  @ApiResponse({
    status: 200,
    description: 'Data exported successfully',
    type: Object,
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiBearerAuth('superuser-api-key')
  async exportData(@Res() res: Response) {
    const data = await this.adminService.exportData();
    res.json(data);
  }

  @Get('backups')
  @Superuser()
  @ApiOperation({
    summary: 'List all available backups',
    description: 'Returns a list of all backup files available for restoration.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of backup files',
    schema: {
      example: {
        backups: [
          './backups/backup_20240315_143022.sql',
          './backups/backup_20240314_120000.sql',
        ],
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Superuser access required' })
  @ApiBearerAuth('superuser-api-key')
  async listBackups() {
    const backups = await this.adminService.listBackups();
    return {
      backups,
    };
  }
}
