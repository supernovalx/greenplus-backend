import { Role } from 'src/common/enums/roles';
import { Contribution } from 'src/modules/contribution/entities/contribution.entity';
import { Faculty } from 'src/modules/faculty/entities/faculty.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @CreateDateColumn()
  createAt: Date;

  @Column({
    default: false,
  })
  forceChangePassword: boolean;

  @ManyToOne(() => Faculty, (faculty) => faculty.users)
  faculty: Faculty;

  @ManyToOne(() => Contribution, (contribution) => contribution.user)
  contributions: Contribution;
}
