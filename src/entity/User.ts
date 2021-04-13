import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Address } from './Address';
import { Notification } from './Notification';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'date' })
  birthDate: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(() => Address, (address) => address.users, {
    cascade: true,
  })
  @JoinTable()
  addresses: Address[];

  @ManyToMany(() => Notification, (notification) => notification.users, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  notifications: Notification[];
}
