import {
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';
import { Contribution } from './contribution.entity';

@Entity()
export class ContributionComment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ContributionComment, (comment) => comment.childComments)
  parentComment: ContributionComment;

  @OneToMany(() => ContributionComment, (comment) => comment.parentComment)
  childComments: ContributionComment[];

  @ManyToOne(() => Contribution, (contribution) => contribution.comments)
  contribution: Contribution;

  @Column()
  comment: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
