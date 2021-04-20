import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Address } from './Address';
import { Cart } from './Cart';
import { Notification } from './Notification';
import { Order } from './Order';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
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

  @OneToMany(() => Address, (address) => address.user, {
    cascade: true,
  })
  @JoinTable()
  addresses: Address[];

  @OneToOne(() => Cart, (cart) => cart.user, {
    cascade: true,
    persistence: false,
  })
  @JoinColumn()
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user, {
    cascade: true,
  })
  @JoinTable()
  orders: Order[];

  @ManyToMany(() => Notification, (notification) => notification.users, {
    cascade: true,
    persistence: false,
  })
  @JoinTable()
  notifications: Notification[];
}
