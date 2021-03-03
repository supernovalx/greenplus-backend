import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contribution } from './contribution.entity';

@Entity()
export class ContributionFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contributionId: number;

  @ManyToOne(() => Contribution, (contribution) => contribution.files, {
    onDelete: 'CASCADE',
  })
  contribution: Contribution;

  @Column()
  file: string;

  @CreateDateColumn()
  createAt: Date;
}
