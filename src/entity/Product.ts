import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Category } from './Category';

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

  @ManyToMany(() => Category/*, category => category.products*/)
  @JoinTable()
  categories: Category[];

}