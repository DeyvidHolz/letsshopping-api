import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Product } from './Product';
import { ProductOptionValue } from './ProductOptionValue';

@Entity({ name: 'product_options' })
export class ProductOption {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => Product, (product) => product.options)
  @JoinTable()
  product: Product;

  @OneToMany(() => ProductOptionValue, (value) => value.option, { eager: true })
  values: ProductOptionValue[];
}
