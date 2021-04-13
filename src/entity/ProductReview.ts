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

@Entity({ name: 'product_reviews' })
export class ProductReview {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column({ width: 1 })
  rating: number;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => Product, (product) => product.reviews)
  @JoinTable()
  product: Product;
}
