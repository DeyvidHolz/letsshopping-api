import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Cart } from './Cart.entity';

@Entity({ name: 'coupons' })
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 6 })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0, comment: '0: Percentage, 1: Fixed value' })
  discountType: number;

  @Column()
  discountAmount: number;

  @Column({ default: 1 })
  maxUsesPerUser: number;

  @Column({ default: -1 })
  maxUsers: number;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  ruleMinPrice: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToOne(() => Cart, (cart) => cart.coupon)
  cart: Cart;
}
