import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SuperuserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const superuserKey = request.headers['x-superuser'];

    // Check if the SUPERUSER_API_KEY matches
    if (!superuserKey) {
      throw new ForbiddenException('Superuser access denied: No credentials provided');
    }

    const validKey = process.env.SUPERUSER_API_KEY;
    if (superuserKey !== validKey) {
      throw new ForbiddenException('Superuser access denied: Invalid credentials');
    }

    return true;
  }
}
