import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Category } from './Category';
import { ProductOption } from './ProductOption';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true, length: 6 })
  code: string;

  @Column()
  name: string;

  @Column()
  shortDescription: string;

  @Column('text')
  description: string;

  @Column()
  mainImage: string;

  @Column()
  isActive: boolean;

  @Column({ default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToMany(() => Category, (category) => category.products, { eager: true })
  @JoinTable()
  categories: Category[];

  @OneToMany(() => ProductOption, (option) => option.product, { eager: true })
  @JoinTable()
  options: ProductOption[];
}
