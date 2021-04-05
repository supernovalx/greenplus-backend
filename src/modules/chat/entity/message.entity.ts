import { Role } from 'src/common/enums/roles';
import { ContributionComment } from 'src/modules/contribution/entities/contribution-comment.entity';
import { Contribution } from 'src/modules/contribution/entities/contribution.entity';
import { Faculty } from 'src/modules/faculty/entities/faculty.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createAt: Date;

  @Column()
  senderId: number;

  @ManyToOne(() => User, (user) => user.sentMessages, { onDelete: 'CASCADE' })
  sender: User;

  @Column()
  receiverId: number;

  @ManyToOne(() => User, (user) => user.receivedMessages, {
    onDelete: 'CASCADE',
  })
  receiver: User;
}
