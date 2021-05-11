import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { Product } from './Product.entity';
import { User } from './User.entity';

@Entity({ name: 'product_reviews' })
export class ProductReview {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
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

  @ManyToOne(() => User, (user) => user.productReviews, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  user: User;
}
