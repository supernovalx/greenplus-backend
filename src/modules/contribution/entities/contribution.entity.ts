import { ContributionComment } from 'src/modules/contribution/entities/contribution-comment.entity';
import { Faculty } from 'src/modules/faculty/entities/faculty.entity';
import { User } from 'src/modules/user/entities/user.entity';
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

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.contributions, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  facultyId: number;

  @ManyToOne(() => Faculty, (faculty) => faculty.contributions, {
    onDelete: 'CASCADE',
  })
  faculty: Faculty;

  @OneToMany(() => ContributionComment, (comment) => comment.contribution)
  comments: ContributionComment[];

  @OneToMany(() => ContributionFile, (file) => file.contribution, {
    cascade: ['insert'],
  })
  files: ContributionFile[];

  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: 0 })
  views: number;

  @Column()
  thumbnail: string;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
