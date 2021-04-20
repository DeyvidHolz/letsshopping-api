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
import { CartProduct } from './CartProduct';
import { Coupon } from './Coupon';
import { Product } from './Product';
import { User } from './User';

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

  // @ManyToMany(() => Product, (product) => product.carts, {
  //   eager: true,
  //   cascade: true,
  //   // persistence: false,
  // })
  // @JoinTable()
  // products: Product[];

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart, {
    eager: true,
    // cascade: true,
  })
  cartProducts: CartProduct[];

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
