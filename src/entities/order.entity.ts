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
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { OrderEvent } from './order-event.entity';
import { OrderAddress } from './order-address.entity';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Address } from './address.entity';
import { Shipping } from './shipping.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  totalValue: number;

  @Column()
  subtotal: number;

  @Column()
  freightValue: number;

  @Column({
    default: 0,
    comment: '0: Created, 1: In Analysis, 2: Paid, 3: Not Paid, 4: Refunded',
  })
  status: number;

  @Column({ comment: '0: CREDIT_CARD', default: 0 })
  paymentMethod: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinTable()
  user: User;

  @ManyToOne(() => Address, (address) => address.orders, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  address: Address;

  @ManyToOne(() => OrderAddress, (orderAddress) => orderAddress.orders, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  shippingAddress: OrderAddress;

  @ManyToMany(() => Product, (product) => product.orders, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  items: Product[];

  @OneToMany(() => OrderEvent, (orderEvent) => orderEvent.order, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  events: OrderEvent[];

  @OneToOne(() => Shipping, (shipping) => shipping.order, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  shipping: Shipping;
}
