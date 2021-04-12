import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { ProductOption } from './ProductOption';

@Entity({ name: 'product_option_values' })
export class ProductOptionValue {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  value: string;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  mainImage: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => ProductOption, (option) => option.values)
  option: ProductOption;
}
