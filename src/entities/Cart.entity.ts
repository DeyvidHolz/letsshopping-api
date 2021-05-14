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
  ManyToMany,
  AfterLoad,
  AfterInsert,
  AfterUpdate,
  BeforeUpdate,
} from 'typeorm';
import { calculateTotal } from '../helpers/cart.helper';
import { CartProduct } from './CartProduct.entity';
import { Coupon } from './Coupon.entity';
import { Product } from './Product.entity';
import { User } from './User.entity';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  total: number;

  @Column({ type: 'int', default: 0 })
  subtotal: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart, {
    eager: true,
    onDelete: 'CASCADE',
  })
  cartProducts: CartProduct[];

  @OneToOne(() => User, (user) => user.cart, {
    persistence: false,
    onDelete: 'CASCADE',
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
