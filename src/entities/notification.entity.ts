import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  icon: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToMany(() => User, (user) => user.notifications)
  @JoinTable()
  users: User[];
}
