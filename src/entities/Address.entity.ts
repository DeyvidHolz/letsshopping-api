import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './Order.entity';
import { User } from './User.entity';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isMain: boolean;

  @Column({ default: process.env.DEFAULT_ADDRESS_COUNTRY ?? 'CAD' })
  country: string;

  @Column()
  zipCode: string;

  @Column()
  state: string;

  @Column()
  neighbourhood: string;

  @Column()
  street: string;

  @Column()
  number: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => User, (user) => user.addresses)
  @JoinTable()
  user: User;

  @ManyToOne(() => Order, (order) => order.address)
  @JoinColumn()
  orders: Order[];
}
