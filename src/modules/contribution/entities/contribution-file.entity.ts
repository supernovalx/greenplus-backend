import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { Contribution } from './contribution.entity';

@Entity()
export class ContributionFile {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Contribution, (contribution) => contribution.files)
  contribution: Contribution;

  @Column()
  file: string;
}
