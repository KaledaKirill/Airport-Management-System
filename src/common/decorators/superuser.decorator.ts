import { SetMetadata, UseGuards } from '@nestjs/common';
import { SuperuserGuard } from '../guards/superuser.guard';

export const Superuser = () => {
  return (target: any, propertyKey: any, descriptor: PropertyDescriptor) => {
    UseGuards(SuperuserGuard)(target, propertyKey, descriptor);
  };
};
