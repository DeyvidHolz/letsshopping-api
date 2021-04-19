import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Coupon } from './Coupon';
import { Product } from './Product';
import { User } from './User';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(() => Product, (product) => product.cart, {
    eager: true,
    cascade: true,
    persistence: false,
  })
  @JoinTable()
  products: Product[];

  @OneToOne(() => User, (user) => user.cart, {
    persistence: false,
  })
  @JoinColumn()
  user: User;

  @OneToOne(() => Coupon, (coupon) => coupon.cart, {
    eager: true,
    cascade: true,
    persistence: false,
  })
  @JoinColumn()
  coupon: Coupon;
}
