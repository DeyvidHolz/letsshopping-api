import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Order } from './Order';

@Entity({ name: 'order_addresses' })
export class OrderAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  country: string;

  @Column()
  zipcode: string;

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

  @OneToMany(() => Order, (order) => order.deliveryAddress)
  @JoinColumn()
  orders: Order[];
}
