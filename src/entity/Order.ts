import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { OrderEvent } from './OrderEvent';
import { OrderAddress } from './OrderAddress';
import { OrderItem } from './OrderItem';
import { User } from './User';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  totalValue: number;

  @Column()
  freightValue: number;

  @Column({
    default: 0,
    comment: '0: Created, 1: In Analysis, 2: Paid, 3: Not Paid, 4: Refunded',
  })
  status: number;

  @Column({ comment: '0: CREDIT_CARD' })
  paymentMethod: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinTable()
  user: User;

  @OneToOne(() => OrderAddress, (orderAddress) => orderAddress.order, {
    eager: true,
    cascade: true,
  })
  orderAddress: OrderAddress;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  items: OrderItem[];

  @OneToMany(() => OrderEvent, (orderEvent) => orderEvent.order, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  events: OrderEvent[];
}
