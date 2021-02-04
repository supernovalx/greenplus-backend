import { Role } from 'src/common/enums/roles';
import { User } from '../entities/user.entity';

export class UserDto {
  id: number;

  fullName: string;

  email: string;

  role: Role;

  forceChangePassword: boolean;

  facultyName: string;

  constructor(user: User) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.email = user.email;
    this.role = user.role;
    this.forceChangePassword = user.forceChangePassword;
    // this.facultyName = user.faculty.name;
  }
}
