import { Role } from 'src/common/enums/roles';
import { User } from '../entities/user.entity';

export class UserDto {
  id: number;

  fullName: string;

  email: string;

  role: Role;

  forceChangePassword: boolean;

  isBlocked: boolean;

  facultyName: string = '';

  facultyId: number = 0;

  constructor(user: User) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.email = user.email;
    this.role = user.role;
    this.forceChangePassword = user.forceChangePassword;
    this.isBlocked = user.isBlocked;
    if (this.role === Role.STUDENT || this.role === Role.MARKETING_CORDINATOR) {
      this.facultyName = user.faculty.name;
      this.facultyId = user.faculty.id;
    }
  }
}
