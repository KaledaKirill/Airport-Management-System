import { Controller, Post, Get, Body, Res, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Superuser } from '../common/decorators/superuser.decorator';
import { Response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('backup')
  @Superuser()
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
  async restoreBackup(@Body('backupFile') backupFile: string) {
    await this.adminService.restoreBackup(backupFile);
    return {
      success: true,
      message: 'Database restored successfully',
    };
  }

  @Post('export')
  @Superuser()
  async exportData(@Res() res: Response) {
    const data = await this.adminService.exportData();
    res.json(data);
  }

  @Get('backups')
  @Superuser()
  async listBackups() {
    const backups = await this.adminService.listBackups();
    return {
      backups,
    };
  }
}
