import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { Product } from './Product';
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
}
