import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contribution } from './contribution.entity';

@Entity()
export class ContributionComment {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => ContributionComment, (comment) => comment.childComments)
  // parentComment: ContributionComment;

  // @OneToMany(() => ContributionComment, (comment) => comment.parentComment)
  // childComments: ContributionComment[];

  @Column()
  contributionId: number;

  @ManyToOne(() => Contribution, (contribution) => contribution.comments, {
    onDelete: 'CASCADE',
  })
  contribution: Contribution;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  comment: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
