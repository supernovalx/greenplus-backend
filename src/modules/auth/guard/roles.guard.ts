import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/enums/roles';
import { GlobalHelper } from 'src/modules/helper/global.helper';
import { User } from '../../user/entities/user.entity';
import { ROLES_KEY } from '../decorator/auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly globalHelper: GlobalHelper,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    // Any roles can pass if there is no specific role requirements
    if (this.globalHelper.checkArrayIsEmpty(requiredRoles)) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    return requiredRoles.includes((user as User).role);
  }
}
