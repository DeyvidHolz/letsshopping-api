import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  OneToMany,
  OneToOne,
} from 'typeorm';
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
  })
  @JoinTable()
  products: Product[];

  @OneToOne(() => User, (user) => user.cart, {
    cascade: true,
  })
  user: User;
}
