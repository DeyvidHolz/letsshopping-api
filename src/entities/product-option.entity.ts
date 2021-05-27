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
import { Product } from './product.entity';
import { ProductOptionValue } from './product-option-value.entity';

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

  @ManyToOne(() => Product, (product) => product.options, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  product: Product;

  @OneToMany(() => ProductOptionValue, (value) => value.option, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  values: ProductOptionValue[];
}
