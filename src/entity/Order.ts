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
import { OrderEvent } from './OrderEvent';
import { OrderAddress } from './OrderAddress';
import { User } from './User';
import { Product } from './Product';
import { Address } from './Address';

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

  @Column({ comment: '0: CREDIT_CARD' })
  paymentMethod: number;

  // @todo: delivery object + relation

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinTable()
  user: User;

  @OneToOne(() => Address, (address) => address.order, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  address: Address;

  @OneToOne(() => OrderAddress, (orderAddress) => orderAddress.order, {
    eager: true,
    cascade: true,
  })
  deliveryAddress: OrderAddress;

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
}
