import { UserRole } from '@modules/users/enums/user-role.enum';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const ROLES_KEY = 'roles';
export const HasAuthorization = (...roles: UserRole[]) =>
  applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    SetMetadata(ROLES_KEY, roles),
  );
