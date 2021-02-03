import { Role } from 'src/enums/roles';
import { Contribution } from 'src/modules/contribution/entities/contribution.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Faculty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createAt: Date;

  @OneToMany(() => User, (user) => user.faculty)
  users: User[];

  @OneToMany(() => Contribution, (contribution) => contribution.faculty)
  contributions: Contribution[];
}
