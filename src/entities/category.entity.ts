import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  shortDescription: string;

  @Column('text', { nullable: true })
  description: string;

  @ManyToMany(() => Product, (product) => product.categories, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  products: Product[];
}
