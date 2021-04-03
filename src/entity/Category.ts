import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Product } from './Product';

@Entity({ name: 'categories' })
export class Category {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  shortDescription: string;

  @Column('text')
  description: string;

  @ManyToMany(type => Product)
  @JoinTable()
  products: Product[]

}