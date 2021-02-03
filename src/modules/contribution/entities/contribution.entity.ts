import { Faculty } from 'src/modules/faculty/entities/faculty.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { ContributionComment } from 'src/modules/contribution/entities/contribution-comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContributionFile } from './contribution-file.entity';

@Entity()
export class Contribution {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.contributions)
  user: User;

  @ManyToOne(() => Faculty, (faculty) => faculty.contributions)
  faculty: Faculty;

  @OneToMany(() => ContributionComment, (comment) => comment.contribution)
  comments: ContributionComment[];

  @OneToMany(() => ContributionFile, (file) => file.contribution)
  files: File[];

  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: false })
  selected: boolean;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
