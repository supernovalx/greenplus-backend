import { Role } from 'src/common/enums/roles';
import { Message } from 'src/modules/chat/entity/message.entity';
import { ContributionComment } from 'src/modules/contribution/entities/contribution-comment.entity';
import { Contribution } from 'src/modules/contribution/entities/contribution.entity';
import { Faculty } from 'src/modules/faculty/entities/faculty.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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

  @Column({ default: false })
  isBlocked: boolean;

  @CreateDateColumn()
  createAt: Date;

  @Column({
    default: true,
  })
  forceChangePassword: boolean;

  @Column({ nullable: true })
  facultyId?: number;

  @ManyToOne(() => Faculty, (faculty) => faculty.users, { onDelete: 'CASCADE' })
  faculty: Faculty;

  @OneToMany(() => Contribution, (contribution) => contribution.user)
  contributions: Contribution[];

  @OneToMany(() => ContributionComment, (comment) => comment.user)
  comments: ContributionComment[];

  @OneToMany(() => Message, (chat) => chat.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (chat) => chat.receiver)
  receivedMessages: Message[];
}
