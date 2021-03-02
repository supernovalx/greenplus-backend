import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Role } from 'src/common/enums/roles';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/roles.guard';

export const ROLES_KEY = 'roles';
export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    // Swagger decorators
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: `Unauthorized. Require role(s): ${
        roles.length === 0 ? 'any' : roles
      }`,
    }),
  );
}
